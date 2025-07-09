// Global providers file --> Controls how all pages in app initialized

// Global CSS file for leaflet, can only be imported in _app.js
import 'leaflet/dist/leaflet.css';
import { CssBaseline } from '@mui/material';

/*
Component: The page currently being rendered
pageProps: any props to pass to the page
return <Component ... /> --> tells Next.js to render requested page
*/
export default function App({Component, pageProps}) {
    return (
        <>
            <CssBaseline />
            <Component {...pageProps} />
        </>
    );
}