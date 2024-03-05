import {useEffect, useRef, useState} from "react";
import "./App.css";
import { fetchWaifuImageUrls} from "./waifu_pics_api/waifu_pics_api.ts";
import {NsfwCategory, Type} from "./waifu_pics_api/waifu_pics_api_types.ts";
import Grid from '@mui/material/Unstable_Grid2';
import {Dialog, DialogContent} from "@mui/material";

function App() {
    const [images, setImages] = useState<string[]>([]); // Explizite Typangabe für den initialen State als leeres Array
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const observer = useRef<IntersectionObserver | null>(null); // Ref für den Intersection Observer
    const lastImageRef = useRef<HTMLDivElement | null>(null); // Ref für das letzte Bild im Grid

    const fetchImages = async () => {
        setLoading(true);
        try {
            const fetchedImages = await fetchWaifuImageUrls(
                { type: Type.Nsfw, category: NsfwCategory.Neko }
            );

            setImages(prevImages => [...prevImages, ...fetchedImages]);
            console.log("Fetched images:", fetchedImages);
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loading) return;
        fetchImages();
    }, []);

    useEffect(() => {
        // Funktion zum Laden neuer Bilder, wenn das letzte Bild im Grid sichtbar wird
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting) {
                fetchImages();
            }
        };

        // Erstellen des Intersection Observers
        observer.current = new IntersectionObserver(handleIntersection, { threshold: 0.1 });

        // Beobachten des letzten Bilds im Grid
        if (lastImageRef.current) {
            observer.current.observe(lastImageRef.current);
        }

        // Aufräumen beim Unmount
        return () => {
            if (observer.current && lastImageRef.current) {
                observer.current.unobserve(lastImageRef.current);
            }
        };
    }, [images]); // Neubetrachten, wenn neue Bilder hinzugefügt werden


    const handleClickImage = (image: string) => {
        setSelectedImage(image);
    };

    const handleCloseImage = () => {
        setSelectedImage(null);
    };

    console.log(images)
    return (
        <div>
            <Grid container spacing={2}>
                {images.map((image, index) => (
                    <Grid xs={6} sm={4} md={2} key={index}>
                        {index === images.length - 1 ? ( // Wenn es sich um das letzte Bild handelt, setze das Ref
                            <div ref={lastImageRef}>
                                <img className="image" onClick={() => handleClickImage(image)} style={{ width: "100%", height: "auto" }} src={image} alt={`Image ${index}`} />
                            </div>
                        ) : (
                            <img className="image" onClick={() => handleClickImage(image)} style={{ width: "100%", height: "auto" }} src={image} alt={`Image ${index}`} />
                        )}
                    </Grid>
                ))}
            </Grid>
            {loading && <div className="loading">Loading...</div>}
            <Dialog open={!!selectedImage} onClose={handleCloseImage}> {/* Wenn selectedImage nicht null ist, öffne das Dialogfenster */}
                <DialogContent>
                    <img src={selectedImage as string | undefined} alt="Selected Image" style={{ maxWidth: "100%", height: "auto" }} />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default App;
