Enjoy the Free code + Assets 😍
- Support us on YouTube Channel: https://www.youtube.com/channel/UC1H-a1MKEFXRiFlGNLcy7gQ
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Deploy frontend on Vercel

### Build-time environment variables

- `VITE_API_URL`: backend base URL with `/api` suffix.
	- Example: `https://car-rental-backend.onrender.com/api`

### Vercel setup

1. Import `car-rental-website` as a Vercel project.
2. Set Root Directory to `car-rental-website`.
3. Add environment variable `VITE_API_URL` in Vercel project settings.
4. Deploy.

### Routing

- `vercel.json` is included for SPA fallback so React Router routes work after refresh.

## CI workflow

This repository includes workflow [../.github/workflows/website-cicd.yml](../.github/workflows/website-cicd.yml) for frontend CI build validation on push.
