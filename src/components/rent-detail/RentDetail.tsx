import { useState, useRef, MouseEvent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { selectAllRealEstates } from "../../features/real-estates/realestatesSlice";
import { fetchRealEstates } from "../../features/real-estates/realestatesSlice";
import { Grid } from "@mui/material";
import { RentType } from "../../types/RentType";
import { AsyncDispatch } from "../../store";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CircularProgress from "@mui/material/CircularProgress";

export default function RentDetail() {
    const [isImageOpen, setIsImageOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(false);
    const dispatch: AsyncDispatch = useDispatch();

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        setLoading(true);
        dispatch(fetchRealEstates()).then(() => setLoading(false));
    }, [dispatch]);

    const realEstates = useSelector(selectAllRealEstates);

    function getPropertyById(id: string): RentType | undefined {
        return realEstates.find((property) => property.id === id);
    }

    function handleImageClick() {
        setIsImageOpen(true);
    }

    function handleCloseModal(event: MouseEvent) {
        setIsImageOpen(false);
    }

    function handleOutsideClick(event: MouseEvent) {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target as Node)
        ) {
            handleCloseModal(event);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <CircularProgress
                    sx={{
                        color: "gray",
                    }}
                ></CircularProgress>
            </div>
        );
    } else {
        let property;
        if (id) {
            property = getPropertyById(id);
        }

        if (!property) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <h1 className="text-2xl">Property not found...</h1>
                </div>
            );
        }
        return (
            <div>
                <header className="p-8 text-left ml-2">
                    <h1 className="text-black text-3xl font-medium mb-1">
                        {property.title}
                    </h1>
                </header>
                <Grid container className="p-10 pt-0" spacing={4}>
                    <Grid item xs={12} sm={12} md={12} lg={9}>
                        {property.image !== undefined && (
                            <img
                                src={property.image}
                                alt="House"
                                onClick={handleImageClick}
                                className="cursor-pointer"
                            ></img>
                        )}
                        {isImageOpen && (
                            <div
                                className="fixed top-0 left-0 w-screen h-screen bg-black/80 flex justify-center items-center z-10"
                                onClick={handleOutsideClick}
                            >
                                <div
                                    ref={modalRef}
                                    className="relative m-auto max-w-[70vw] max-h-[80vh]"
                                >
                                    <img
                                        className="max-w-full max-h-full"
                                        src={property.image}
                                        alt="House"
                                    ></img>
                                    <button
                                        className="absolute top-0 right-0 m-4 text-white font-bold text-xl"
                                        onClick={handleCloseModal}
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                        )}
                        <Card
                            sx={{
                                minWidth: 275,
                                backgroundColor: "white",
                                marginTop: 3,
                            }}
                        >
                            <CardContent sx={{ color: "black" }}>
                                <h2 className="text-xl font-medium mb-2 underline">
                                    House description
                                </h2>
                                <p>{property.description}</p>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={3}>
                        <Card
                            sx={{
                                minWidth: 275,
                                backgroundColor: "white",
                                marginBottom: 3,
                            }}
                        >
                            <CardContent sx={{ color: "black" }}>
                                <h2 className="text-xl font-medium mb-2 underline">
                                    Price and Location
                                </h2>
                                <ul>
                                    <li>
                                        <b>Price:</b> {property.price} $ / month
                                    </li>
                                    {property.comission !== undefined && (
                                        <li>
                                            <b>Comission:</b>{" "}
                                            {property.comission} $
                                        </li>
                                    )}
                                    <li>
                                        <b>Region:</b> {property.region}
                                    </li>
                                    <li>
                                        <b>City:</b> {property.city}
                                    </li>
                                    <li>
                                        <b>Address:</b> {property.address}
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card
                            sx={{
                                minWidth: 275,
                                backgroundColor: "white",
                            }}
                        >
                            <CardContent sx={{ color: "black" }}>
                                <h2 className="text-xl font-medium mb-2 underline">
                                    Contact details
                                </h2>
                                <p>
                                    <PhoneIcon />{" "}
                                    <a
                                        className="text-black italic font-medium"
                                        href={`tel:${property.phone}`}
                                    >
                                        {property.phone}
                                    </a>
                                </p>
                                <p>
                                    <EmailIcon />{" "}
                                    <a
                                        className="text-black italic font-medium"
                                        href={`mailto:${property.email}`}
                                    >
                                        {property.email}
                                    </a>
                                </p>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
