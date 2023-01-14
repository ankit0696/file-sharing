import axios from "axios";
import {API_URL} from "@/config/index";
import {console} from "next/dist/compiled/@edge-runtime/primitives/console";

export default async function handler(req, res) {
    const { uid } = req.query
    try {
        const response = await axios.get(`${API_URL}/api/documents?filters[uid][$eq]=${uid}&populate=*`)
        if (response.status === 200 && response.data.data.length > 0) {
            const download_url = API_URL + response.data.data[0].attributes.file.data.attributes.url
            res.redirect(download_url)
        } else {
            res.status(404).json({message: 'File not found'})
        }

    } catch (e) {
        console.log(e)
    }
    res.status(404).json({message: 'File not found on server'})
}



