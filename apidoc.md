
//page one
>shop>List of type of item eg,1.Hardware and Discs,
                              2.Digital Games,
                              3.Official Merchandise
                              4.Services
https://playstationapi-bfns.onrender.com/category



//page 2
>list of item wrt type of item have selected (1.hardware is selected)
https://playstationapi-bfns.onrender.com/categoryitem?categoryId=1

(hardware have 3 different option,PS5,PS VR2,PS4  available so wrt to  that one)
>list of item wrt type of item have selected + PS5 or PS VR2 or PS4
https://playstationapi-bfns.onrender.com/categoryItem?categoryId=1&subCategoryId=1

>https://playstationapi-bfns.onrender.com/categoryItem?categoryId=1&subCategoryId=2

>https://playstationapi-bfns.onrender.com/categoryItem?categoryId=1&subCategoryId=3



>If have selected "Digital Games"
>list of games
https://playstationapi-bfns.onrender.com/gameIdProduct

>game section have sorting option 1.genre wise and 2.Playable device wise 
>list of game + genre
https://playstationapi-bfns.onrender.com/gameIdproduct?gerneId=1&3

>list of games + playable device
https://playstationapi-bfns.onrender.com/gameIdproduct?playableDeviceId=1

list of game + genre + playable device
https://playstationapi-bfns.onrender.com/gameIdproduct?playableDeviceId=1&genreId=3



//page 3
>details of item (of hardware item)
https://playstationapi-bfns.onrender.com/details/6488248fbf0bdbf67e9da2f7

>other products of selected item
>https://playstationapi-bfns.onrender.com/menuitem/1



//page 4
>detail of product added to cart
https://playstationapi-bfns.onrender.com/productDetails

>place orders
https://playstationapi-bfns.onrender.com/placeOrder
eg.
[
    {
        "_id": "648af4fcf409be684cbd38e2",
        "name": "Arjun gupta",
        "email": "arjung@gmail.com",
        "address": "Hno 25,Sector 2",
        "phone": 97645673,
        "cost": 12451,
        "menuItem": [
            3,
            6
        ]
    }
]


//page 5
>list of orders 
https://playstationapi-bfns.onrender.com/orders

>update orders details
https://playstationapi-bfns.onrender.com/updateOrder

>delete orders
https://playstationapi-bfns.onrender.com/deleteOrder