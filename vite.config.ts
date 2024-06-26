import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolve } from "path";

const publicDir = resolve(__dirname, "./public");

export default defineConfig({
    publicDir,
    plugins: [react()],
    server:
    {
        host: true, // Open to local network and display URL
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) // Open if it's not a CodeSandbox
    },
    build:
    {
        outDir: './dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: true // Add sourcemap
    },
})