import { useState } from "react";
import Globe from "react-globe.gl";
import countries from "../../small_geoJson.json";

interface FeatureCollection {
  type: "FeatureCollection";
  features: Country[];
}

interface Country {
  type: "Feature";
  properties: {
    name: string;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: any;
  };
}

function Main() {
  const [guessedCountries, setGuessedCountries] = useState<Set<string>>(
    new Set(),
  );
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const [answer, setAnswer] = useState("");

  const [hoverCountry, setHoverCountry] = useState<Country | null>(null);

  const selectedName = selectedCountry?.properties.name;
  const hoverName = hoverCountry?.properties.name;

  const checkAnswer = () => {
    if (!selectedCountry) return;

    const correctName = selectedCountry.properties.name.toLowerCase();

    if (answer.trim().toLocaleLowerCase() === correctName) {
      setGuessedCountries((prev) => {
        const next = new Set(prev);
        next.add(selectedCountry.properties.name);
        return next;
      });

      alert("Correct");
    } else {
      alert("Incorrect!");
    }

    setAnswer("");
    setSelectedCountry(null);
  };

  return (
    <>
      <Globe
        polygonsData={countries.features}
        polygonCapColor={(country: Country) => {
          const name = country.properties.name;

          if (guessedCountries.has(name)) return "#4caf50";

          if (selectedName === name) return "rgba(255,255,255,0.8)";

          if (hoverName === name) return "rgba(255,255,255,0.3)";

          return "rgba(0,0,0,0)";
        }}
        polygonStrokeColor={() => "#888"}
        onPolygonClick={(country: Country) => {
          if (guessedCountries.has(country.properties.name)) return;
          setSelectedCountry(country);
        }}
        onPolygonHover={(country: Country | null) => {
          setHoverCountry(country);
        }}
      />

      {selectedCountry && (
        <div className="inputOverlay">
          <input
            className="countryInput"
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter country name"
            autoFocus
          />
          <button className="submitButton" onClick={checkAnswer}>
            Submit
          </button>
        </div>
      )}
    </>
  );
}

export default Main;
