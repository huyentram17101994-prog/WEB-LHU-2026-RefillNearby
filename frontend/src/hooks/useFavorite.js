import { useEffect, useState } from "react";
import api from "../services/api";

export default function useFavorite(type) {

    const [favorites, setFavorites] = useState([]);

    const token = localStorage.getItem("token");

    const url =

        type === "products"

        ? "/favorites/products"

        : "/favorites";

    // ==========================
    // Load
    // ==========================

    const fetchFavorites = async () => {

        try {

            const res = await api.get(

                url,

                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }

            );

            setFavorites(res.data);

        }

        catch(err){

            console.log(err);

        }

    };

    // ==========================
    // Add
    // ==========================

    const addFavorite = async(id)=>{

        try{

            const body =

                type==="products"

                ?

                { product_id:id }

                :

                { station_id:id };

            await api.post(

                url,

                body,

                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }

            );

            fetchFavorites();

        }

        catch(err){

            console.log(err);

        }

    };

    // ==========================
    // Remove
    // ==========================

    const removeFavorite = async (id) => {

    const token = localStorage.getItem("token");

    if (type === "products") {

        const old = favorites.find(
            item => item.product_id === id
        );

        if (!old) return;

        await api.delete(

            `/favorites/products/${old.favorite_product_id}`,

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

    }

    else {

        const old = favorites.find(
            item => item.station_id === id
        );

        if (!old) return;

        await api.delete(

            `/favorites/${old.favorite_id}`,

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

    }

    fetchFavorites();

};

    // ==========================
    // Check
    // ==========================

    const isFavorite = (id)=>{

        return favorites.some(item=>{

            return type==="products"

                ?

                item.product_id===id

                :

                item.station_id===id;

        });

    };

    // ==========================
    // Toggle
    // ==========================

    const toggleFavorite = async (id) => { const favorite = favorites.find(item => 
        { 
            return type === "products" ? item.product_id === id : item.station_id === id; }); 
    if (favorite) { await removeFavorite(id); } 
    else { await addFavorite(id); } };
    useEffect(()=>{

        fetchFavorites();

    },[]);

    return{

        favorites,

        toggleFavorite,

        isFavorite,

        fetchFavorites,
        removeFavorite

    };

}