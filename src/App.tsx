import {useEffect, useRef, useState} from "react";
import "./App.css";
import {fetchWaifuImageUrl, fetchWaifuImageUrls} from "./waifu_pics_api/waifu_pics_api.ts";
import {NsfwCategory, Type} from "./waifu_pics_api/waifu_pics_api_types.ts";

function App() {
    const [images, setImages] = useState<string[]>([]); // Explizite Typangabe für den initialen State als leeres Array
    const [loading, setLoading] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null); // Typangabe für useRef

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            try {
                const fetchedImages = await fetchWaifuImageUrls(
                    {type: Type.Nsfw, category: NsfwCategory.Neko},
                );

                setImages((prevImages) => [...prevImages, ...fetchedImages]);
                console.log("Fetched images:", fetchedImages);
            } catch (error) {
                console.error("Error fetching images:", error);
            } finally {
                setLoading(false);
            }
        };
        if (loading) return;
        fetchImages();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                fetchImages();
            }
        }, {threshold: 1});

        const loadingElement = document.querySelector('.loading');
        if (loadingElement) {
            observer.current!.observe(loadingElement);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, []);

    console.log(images)
    return (
        <div>
            <div className="image-stack" style={{maxWidth: "100vw", alignItems: "center", alignContent: "center", justifyContent: "center"}}>
                {images.map((image, index) => (
                    <div key={index} className="image-item">
                        <img style={{
                            display: "block",
                            maxWidth: "95vw",
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: "50%"
                        }} src={image} alt={`Image ${index}`}/>
                    </div>
                ))}
            </div>
            {loading && <div className="loading">Loading...</div>}
        </div>
    );
}

export default App;
