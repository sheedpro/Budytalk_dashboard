import React, { useState } from "react";
import { Check, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LocationProps {
  onSelect?: (location: string) => void;
  selected?: string;
}

const Locations: React.FC<LocationProps> = ({
  onSelect,
  selected = "",
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Locations around Kampala including sub-counties and small places
  const locations = [
    // Central Kampala
    "Kampala Central",
    "Nakasero",
    "Old Kampala",
    "Kisenyi",
    "Kamwokya",
    "Kololo",
    "Industrial Area",
    "Bukesa",
    "Kagugube",
    "Kivulu",
    "Namirembe",
    "Bakuli",
    "Mengo",
    "Rubaga",
    
    // Nakawa Division
    "Nakawa",
    "Bugolobi",
    "Luzira",
    "Mbuya",
    "Mutungo",
    "Butabika",
    "Banda",
    "Kireka",
    "Kyambogo",
    "Ntinda",
    "Kiwaatule",
    "Kisaasi",
    "Kyanja",
    "Kulambiro",
    "Najjera",
    "Naalya",
    "Namugongo",
    "Kyaliwajjala",
    "Bweyogerere",
    "Kirinya",
    "Namanve",
    
    // Makindye Division
    "Makindye",
    "Nsambya",
    "Kibuli",
    "Kabalagala",
    "Kansanga",
    "Lukuli",
    "Buziga",
    "Luwafu",
    "Ggaba",
    "Munyonyo",
    "Muyenga",
    "Kisugu",
    "Bukasa",
    "Katwe",
    "Kibuye",
    "Salaama",
    
    // Kawempe Division
    "Kawempe",
    "Bwaise",
    "Makerere",
    "Mulago",
    "Wandegeya",
    "Kalerwe",
    "Kyebando",
    "Mpererwe",
    "Komamboga",
    "Kikaya",
    "Kanyanya",
    "Kazo",
    "Lugoba",
    "Kisalosalo",
    "Ttula",
    "Kikuubo",
    "Maganjo",
    
    // Rubaga Division
    "Rubaga",
    "Kasubi",
    "Kawaala",
    "Ndeeba",
    "Kabowa",
    "Natete",
    "Lubaga",
    "Lungujja",
    "Busega",
    "Mutundwe",
    "Nateete",
    "Namungoona",
    "Masanafu",
    "Nabulagala",
    
    // Outskirts and Neighboring Areas
    "Entebbe",
    "Kajjansi",
    "Bwebajja",
    "Lubowa",
    "Seguku",
    "Zana",
    "Namasuba",
    "Ndejje",
    "Kyengera",
    "Buddo",
    "Nansana",
    "Wakiso",
    "Matugga",
    "Gayaza",
    "Kasangati",
    "Mukono",
    "Seeta",
    "Kira",
    "Bulindo",
    "Kiwenda",
    "Kakiri",
    "Bulenga",
  ].sort();

  const handleLocationSelect = (location: string) => {
    if (onSelect) {
      onSelect(location);
    }
  };

  const filteredLocations = locations.filter(location => 
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex items-center px-2 py-1 border rounded-md">
        <Search className="h-4 w-4 mr-2 opacity-50" />
        <Input 
          placeholder="Search locations..." 
          className="border-0 p-0 focus-visible:ring-0 h-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />
      </div>
      
      <div className="mt-2 max-h-[200px] overflow-y-auto border rounded-md">
        {filteredLocations.length > 0 ? (
          filteredLocations.map((location) => (
            <div
              key={location}
              className={`flex items-center justify-between cursor-pointer p-2 hover:bg-accent ${selected === location ? 'bg-accent/50' : ''}`}
              onClick={() => handleLocationSelect(location)}
            >
              <span>{location}</span>
              {selected === location && <Check className="h-4 w-4 text-green-500" />}
            </div>
          ))
        ) : (
          <div className="py-3 px-2 text-center text-muted-foreground">
            No locations found
          </div>
        )}
      </div>
    </div>
  );
};

export default Locations;
