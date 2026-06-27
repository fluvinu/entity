import { handle } from "hono/netlify"
import app from "../../api/boot"

export default handle(app)
