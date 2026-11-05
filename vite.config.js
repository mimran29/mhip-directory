import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Runs api/*.js (the Vercel functions) inside `npm run dev`, so the job
// application form can be tested locally. Put SMTP_USER / SMTP_PASS in
// .env.local to really send email while developing.
function localApi(env) {
  return {
    name: 'local-api',
    configureServer(server) {
      Object.assign(process.env, env)
      server.middlewares.use('/api/', async (req, res) => {
        const name = req.url.split('?')[0].replace(/^\//, '')
        if (!/^[a-z-]+$/.test(name)) { res.statusCode = 404; return res.end() }
        let raw = ''
        for await (const chunk of req) raw += chunk
        try { req.body = raw ? JSON.parse(raw) : {} } catch { req.body = {} }
        res.status = (code) => { res.statusCode = code; return res }
        res.json = (obj) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)) }
        try {
          const mod = await server.ssrLoadModule(`/api/${name}.js`)
          await mod.default(req, res)
        } catch (err) {
          console.error(err)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Local API error' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), localApi(loadEnv(mode, process.cwd(), ''))],
}))
