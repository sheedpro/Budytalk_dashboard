import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { userTypes } from "@/Redux/slices/UserSlice/UserTypes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Fix default icon issue in Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

// Define the type for user locations with coordinates
type UserLocationWithCoords = userTypes & {
  lat?: number;
  lng?: number;
};

// Component props
type UserLocationMapProps = {
  UserLocation: userTypes[];
};

const UserLocationMap: React.FC<UserLocationMapProps> = ({ UserLocation }) => {
  const [userLocations, setUserLocations] = useState<UserLocationWithCoords[]>([]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!Array.isArray(UserLocation)) {
        console.error("UserLocation is not an array");
        return;
      }

      const geocodedLocations = await Promise.all(
        UserLocation.map(async (user) => {
          if (!user.location) {
            console.warn(`No location provided for user ${user.full_name}`);
            return null;
          }

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(user.location)}&format=json`
            );
            const data = await response.json();
            if (data.length > 0) {
              return {
                ...user,
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
              };
            } else {
              console.warn(`No coordinates found for location: ${user.location}`);
              return null;
            }
          } catch (error) {
            console.error(`Error fetching coordinates for location: ${user.location}`, error);
            return null;
          }
        })
      );

      // Filter out null results
      setUserLocations(geocodedLocations.filter((location) => location !== null) as UserLocationWithCoords[]);
    };

    fetchCoordinates();
  }, [UserLocation]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Users Map</CardTitle>
      </CardHeader>
      <CardContent>
        <MapContainer
          center={[0.3476, 32.5825]} // Default center: Kampala
          zoom={6}
          style={{ height: "400px", width: "100%", display: "flex", justifyContent: "center" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Add user markers */}
          {userLocations.map((user) =>
            user.lat !== undefined && user.lng !== undefined ? (
              <Marker key={user.id} position={[user.lat, user.lng]}>
                <Popup>
                  <strong>{user.full_name}</strong> <br />
                  Lives in {user.location}
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </CardContent>
    </Card>
  );
};

export default UserLocationMap;