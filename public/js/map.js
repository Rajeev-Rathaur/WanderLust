
    let maptoken=map_token;
    console.log(maptoken);
    const map = new mapboxgl.Map({
        accessToken:maptoken,
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 10 // starting zoom
    });

     // Create a default Marker and add it to the map.
    const marker1 = new mapboxgl.Marker({ color: 'red', rotation: 45 })
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h4>${listing.location}</h4><p>Exact Location provided after booking</h4>`
            
        ))
        .addTo(map);
