import Activity from "./Activity.jsx";
import { useSelector, useDispatch } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";

const SuggestionCarousel = () => {
  const activities = useSelector((state) => state.activities);
  const user = useSelector((state) => state.user);
  const userLocation = user.geolocation;

  function calcularDistancia(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radio de la Tierra en kilómetros
    let dLat = (lat2 - lat1) * (Math.PI / 180);
    let dLon = (lon2 - lon1) * (Math.PI / 180);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distancia = R * c;
    return distancia;
  }

  // Coordenadas del userLocation
  let userLat = userLocation ? userLocation.lat : "";
  let userLon = userLocation ? userLocation.lng : "";

  // Calcular la distancia entre el userLocation y cada ubicación en eventLocations
  activities.forEach(function (act) {
    let eventLat = act.location.lat;
    let eventLon = act.location.lng;
    console.log(eventLat, eventLon);
    let distancia = calcularDistancia(userLat, userLon, eventLat, eventLon);
    act.distancia = distancia;
  });
  //crear estado global alternativo para renderizar actividades totales.
  return (
    <div className="bg-grey grid grid-cols-1 sm:grid-cols-2 md:flex md:justify-center gap-4 ml-1 mr-1 mt-3 ">
      <Carousel
        showThumbs={false}
        showStatus={false}
        showArrows={true}
        infiniteLoop={true}
        autoPlay={true}
        interval={6000}
        transitionTime={600}
        centerMode={true}
        centerSlidePercentage={100}
        showIndicators={false}
        className="md:m-auto md:max-w-[500px]"
      >
        {activities.length > 0 ? (
          activities
            .sort(function (a, b) {
              return a.distancia - b.distancia;
            })
            .map(
              ({
                id,
                name,
                eventDate,
                image,
                location,
                minCost,
                minSizePeople,
                place,
              }) => {
                return (
                  <Activity
                    key={id}
                    id={id}
                    name={name}
                    eventDate={eventDate.split("T")[0]}
                    image={image}
                    // location={location.latlng}
                    minCost={minCost}
                    minSizePeople={minSizePeople}
                    place={place}
                  />
                );
              }
            )
        ) : (
          <div>
            <h2 className="font-quick">No hay actividades cerca de tu zona</h2>
          </div>
        )}
      </Carousel>
    </div>
  );
};

export default SuggestionCarousel;