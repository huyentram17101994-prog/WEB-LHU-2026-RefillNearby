import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import flagIcon from "../assets/vietnam.png";

const islandIcon = new L.Icon({

    iconUrl: flagIcon,

    iconSize: [34, 34],

    iconAnchor: [17, 34],

    tooltipAnchor: [0, -28]

});
const islands = [

    {
        id: 1,
        name: "Quần đảo Hoàng Sa",
        position: [16.5, 112.2]
    },

    {
        id: 2,
        name: "Quần đảo Trường Sa",
        position: [9.8, 114.3]
    }

];

export default function VietnamSovereigntyLayer() {

    return (

        <>

            {islands.map((island) => (

                <Marker
                    key={island.id}
                    position={island.position}
                    icon={islandIcon}
                >

                    <Tooltip
                        permanent
                        direction="top"
                        offset={[0, -15]}
                    >

                        <div
                            style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "10px"
                            }}
                        >

                            🇻🇳 {island.name}

                            <br />

                            <span
                                style={{
                                    color: "#dc2626"
                                }}
                            >
                                Việt Nam
                            </span>

                        </div>

                    </Tooltip>

                </Marker>

            ))}

        </>

    );

}