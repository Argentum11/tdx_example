
    GetAuthorizationHeader();
    
    GetApiResponse();    

function GetAuthorizationHeader() {    
    const parameter = {
        grant_type:"client_credentials",
        client_id: client_id,
        client_secret: client_secret
    };
    
    let auth_url = "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";
        
    $.ajax({
        type: "POST",
        url: auth_url,
        crossDomain:true,
        dataType:'JSON',                
        data: parameter,
        async: false,       
        success: function(data){            
            $("#accesstoken").text(JSON.stringify(data));                            
        },
        error: function (xhr, textStatus, thrownError) {
            
        }
    });          
}

function create_card(restaurant){
    let image_url = "";
    if(restaurant.Picture.PictureUrl1){
        image_url = restaurant.Picture.PictureUrl1;
    }
    else{
        image_url = "image_not_supported.png";
    }
    /* Don't use 
    let image_url =restaurant.Picture.PictureUrl1;
    there are some restaurants that don't have the Picture attribute */
    if(restaurant.Description.length>30){
        restaurant.Description = restaurant.Description.substring(0,50);
    }
     
    let card = `<div class="card" style="width: 18rem;">
                    <img src="${image_url}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${restaurant.RestaurantName}</h5>
                        <p class="card-text">${restaurant.Description}</p>
                        <p class="card-text">${restaurant.Phone}</p>
                        <p class="card-text">${restaurant.Address}</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                </div>`;
    return card;
}

function output_card(restaurant){
    document.getElementById("restaurants").innerHTML += create_card(restaurant);
}

function GetApiResponse(){    
    let accesstokenStr = $("#accesstoken").text();    

    let accesstoken = JSON.parse(accesstokenStr);    

    if(accesstoken !=undefined){
        $.ajax({
            type: 'GET',
            url: 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant/Tainan?%24top=30&%24format=JSON&%24skip=0',    
            headers: {
                "authorization": "Bearer " + accesstoken.access_token, 
              },            
            async: false,
            success: function (Data) {
                //$('#apireponse').text(JSON.stringify(Data));
                document.getElementById("restaurants").innerHTML = "";
                console.log(Data);
                let restaurant_list = Data;
                restaurant_list.forEach(output_card);                
            },
            error: function (xhr, textStatus, thrownError) {
                console.log('errorStatus:',textStatus);
                console.log('Error:',thrownError);
            }
        });
    }
}