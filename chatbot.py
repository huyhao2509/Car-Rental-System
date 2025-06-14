import openai
import os
from PyPDF2 import PdfReader
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import sys
import json
import logging

# Cấu hình logging
logging.basicConfig(stream=sys.stderr, level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Cấu hình OpenAI API Key ---
# Lấy API key từ biến môi trường
openai.api_key = os.getenv("OPENAI_API_KEY")

if not openai.api_key:
    # Nếu không có trong môi trường, thử đọc từ file (không khuyến khích trong production)
    try:
        from api_key import OPENAI_API_KEY
        openai.api_key = OPENAI_API_KEY
        os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
    except (ImportError, KeyError):
        logging.error("Lỗi: Vui lòng đặt biến môi trường 'OPENAI_API_KEY'.")
        logging.error("Bạn có thể lấy API key từ https://platform.openai.com/account/api-keys")
        sys.exit(1)

# Định nghĩa model embedding sử dụng
EMBEDDING_MODEL = "text-embedding-3-large"
GPT_MODEL = "gpt-3.5-turbo"

# --- 1. Tải và Xử lý PDF theo trang ---
def load_pdf_by_pages(pdf_path):
    """
    Tải file PDF và trích xuất văn bản từ mỗi trang.
    Trả về list các dictionary, mỗi dict chứa 'page_num' và 'text'.
    """
    if not os.path.exists(pdf_path):
        logging.error(f"Lỗi: Không tìm thấy file PDF tại đường dẫn: {pdf_path}")
        return []
        
    pages_data = []
    try:
        with open(pdf_path, 'rb') as file:
            reader = PdfReader(file)
            total_pages = len(reader.pages)
            logging.info(f"Đang đọc {total_pages} trang từ PDF...")
            for page_num in range(total_pages):
                page = reader.pages[page_num]
                text = page.extract_text()
                if text: # Chỉ thêm trang có nội dung
                    pages_data.append({
                        "page_num": page_num + 1,
                        "text": text
                    })
        logging.info(f"Đã trích xuất văn bản từ {len(pages_data)} trang có nội dung.")
    except Exception as e:
        logging.error(f"Lỗi khi tải hoặc đọc PDF: {e}")
        return []
    return pages_data

# --- 2. Tạo Embeddings cho mỗi trang ---
def create_page_embeddings(pages_data, model=EMBEDDING_MODEL):
    """
    Tạo vector embeddings cho văn bản của từng trang.
    """
    if not pages_data:
        return []
    
    texts_to_embed = [page["text"] for page in pages_data]
    
    try:
        logging.info(f"Đang tạo embeddings cho {len(texts_to_embed)} trang bằng model '{model}'...")
        response = openai.embeddings.create(input=texts_to_embed, model=model)
        embeddings = [embedding.embedding for embedding in response.data]
        
        for i, page_data in enumerate(pages_data):
            page_data["embedding"] = embeddings[i]
        
        logging.info("Đã tạo embeddings thành công.")
        return pages_data
    except openai.APIError as e:
        logging.error(f"Lỗi OpenAI API khi tạo embeddings: {e}")
        return []
    except Exception as e:
        logging.error(f"Lỗi không xác định khi tạo embeddings: {e}")
        return []

# --- 3. Tìm kiếm ---
def get_embedding(text, model=EMBEDDING_MODEL):
    """Tạo embedding cho một đoạn văn bản (ví dụ: câu hỏi người dùng)."""
    try:
        response = openai.embeddings.create(input=[text], model=model)
        return response.data[0].embedding
    except Exception as e:
        logging.error(f"Lỗi khi tạo embedding cho câu hỏi: {e}")
        return None

def find_most_relevant_pages(query_embedding, all_pages_data, top_n=3):
    """
    Tìm kiếm các trang PDF liên quan nhất dựa trên độ tương đồng cosine.
    """
    if not query_embedding or not all_pages_data:
        return []

    similarities = []
    for page_data in all_pages_data:
        if "embedding" in page_data:
            sim = cosine_similarity(
                np.array(query_embedding).reshape(1, -1), 
                np.array(page_data["embedding"]).reshape(1, -1)
            )[0][0]
            similarities.append((sim, page_data))
    
    similarities.sort(key=lambda x: x[0], reverse=True)
    return [page_data for sim, page_data in similarities[:top_n]]

# --- 4. Tạo phản hồi Chatbot ---
def generate_chatbot_response(user_query, relevant_pages_info, model=GPT_MODEL):
    """
    Tạo câu trả lời của chatbot bằng OpenAI GPT.
    """
    if not relevant_pages_info:
        return "Xin lỗi, tôi không tìm thấy thông tin liên quan trong tài liệu để trả lời câu hỏi của bạn."

    context_str = ""
    for page_info in relevant_pages_info:
        context_str += f"--- Trang {page_info['page_num']} ---\n{page_info['text']}\n\n"
    
    messages = [
        {"role": "system", "content": "Bạn là một trợ lý AI hữu ích, chuyên trả lời câu hỏi dựa trên thông tin được cung cấp từ một tài liệu PDF. Nếu bạn không tìm thấy thông tin trong ngữ cảnh, hãy nói rõ ràng rằng bạn không biết."},
        {"role": "user", "content": f"Dựa trên các thông tin sau từ tài liệu PDF:\n\n{context_str}\n\nNgười dùng hỏi: {user_query}\n\nTrả lời câu hỏi của người dùng. Không được trích xuất trang từ tài liệu"}
    ]
    
    try:
        response = openai.chat.completions.create(
            model=model,
            messages=messages,
            max_tokens=500,
            temperature=0.4
        )
        return response.choices[0].message.content
    except Exception as e:
        logging.error(f"Lỗi OpenAI API khi tạo phản hồi: {e}")
        return "Xin lỗi, tôi gặp sự cố khi tạo phản hồi. Vui lòng thử lại sau."

# --- Workflow chính ---
def main():
    # Đường dẫn đến file PDF, tương đối với thư mục gốc của backend
    script_dir = os.path.dirname(os.path.abspath(__file__))
    pdf_file_path = os.path.join(script_dir, "car-rental-backend", "chatbotPDF.pdf")


    # --- Bước 1 & 2: Tải PDF và tạo Embeddings ---
    all_pages_data = load_pdf_by_pages(pdf_file_path)
    if not all_pages_data:
        logging.error("Không có dữ liệu trang PDF để xử lý. Chương trình kết thúc.")
        sys.exit(1)
        
    all_pages_with_embeddings = create_page_embeddings(all_pages_data, model=EMBEDDING_MODEL)
    if not all_pages_with_embeddings:
        logging.error("Không thể tạo embeddings cho các trang. Chương trình kết thúc.")
        sys.exit(1)
    
    # --- Báo hiệu sẵn sàng ---
    logging.info("Chatbot PDF đã sẵn sàng. Đang chờ câu hỏi...")
    sys.stderr.flush()

    # --- Vòng lặp chính để nhận câu hỏi từ Node.js ---
    for line in sys.stdin:
        try:
            # Đọc dữ liệu JSON từ stdin
            request = json.loads(line)
            user_query = request.get("query")
            request_id = request.get("id") # Nhận ID request

            if not user_query:
                continue

            # --- Tìm kiếm và tạo phản hồi ---
            query_embedding = get_embedding(user_query, model=EMBEDDING_MODEL)
            if not query_embedding:
                response_data = {"error": "Không thể tạo embedding cho câu hỏi."}
            else:
                relevant_pages = find_most_relevant_pages(query_embedding, all_pages_with_embeddings, top_n=3)
                chatbot_response = generate_chatbot_response(user_query, relevant_pages, model=GPT_MODEL)
                response_data = {"response": chatbot_response}
            
            # Thêm ID vào response để Node.js biết xử lý
            response_data["id"] = request_id

            # Gửi phản hồi về cho Node.js qua stdout
            print(json.dumps(response_data), flush=True)

        except json.JSONDecodeError:
            request_id = None
            try:
                # Cố gắng parse để lấy id nếu có thể
                data = json.loads(line)
                request_id = data.get('id')
            except:
                pass
            logging.error(f"Lỗi giải mã JSON từ input: {line.strip()}")
            error_response = {"error": "Invalid JSON input", "id": request_id}
            print(json.dumps(error_response), flush=True)
        except Exception as e:
            # Gửi lỗi kèm ID nếu có thể
            request_id = None
            try:
                data = json.loads(line)
                request_id = data.get('id')
            except:
                pass
            error_response = {"error": f"Đã xảy ra lỗi không xác định: {e}", "id": request_id}
            print(json.dumps(error_response), flush=True)

if __name__ == "__main__":
    main()
