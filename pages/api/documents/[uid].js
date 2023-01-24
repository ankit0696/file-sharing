import axios from "axios";
import {API_URL} from "@/config/index";
import {console} from "next/dist/compiled/@edge-runtime/primitives/console";

export default async function handler(req, res) {
    const { uid } = req.query
    try {
        const response = await axios.get(`${API_URL}/api/documents?filters[uid][$eq]=${uid}&populate=*`)
        if (response.status === 200 && response.data.data.length > 0) {
            const download_url = API_URL + response.data.data[0].attributes.file.data.attributes.url
            // Forcing download
            res.setHeader('Content-Disposition', 'attachment')
            res.setHeader('Content-Transfer-Encoding', 'binary')
            res.setHeader('Expires', '0')
            res.setHeader('Cache-Control', 'must-revalidate, post-check=0, pre-check=0')
            res.setHeader('Pragma', 'public')
            res.setHeader('Content-Length', response.data.data[0].attributes.file.data.attributes.size)
            res.setHeader('Content-Type', response.data.data[0].attributes.file.data.attributes.mime)
            res.setHeader('Content-Description', 'File Transfer')
            res.setHeader('Content-Transfer-Encoding', 'binary')
            res.setHeader('Content-Disposition', 'attachment; filename=' + response.data.data[0].attributes.file.data.attributes.name)

            const file = await axios.get(download_url, {responseType: 'stream'})
            file.data.pipe(res)

        } else {
            res.status(404).json({message: 'File not found'})
        }

    } catch (e) {
        console.log(e)
        res.status(404).json({message: 'File not found on server'})
    }

}



