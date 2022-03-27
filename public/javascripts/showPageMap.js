
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [parseInt(long), parseInt(lat)], // starting position [lng, lat]
    zoom: 5 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat([parseInt(long), parseInt(lat)])
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${title}</h3><p>${place}</p>`
            )
    )
    .addTo(map);



