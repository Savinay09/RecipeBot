# RecipeBot

After realizing that so many household food ingredients are wasted, we looked at potential ways to address this issue. Our initial plan was to build a web application using a GCP backend to store recipes for efficient access. Midway through our implementation, however, we understood that it would not be feasible to use a web app while in the midst of cooking. After reaching out to relatives and soup kitchens, we decided to pivot and build a chatbot instead. This shift was driven by our desire to simplify and streamline the user experience. Utilizing a hands-free platform like Google Home or Alexa would be perfect in this regard. Since upwards of 70% of all smartphones run on the Android platform, we decided to use Dialogflow to build our chatbot.

To build our agent, we first defined and mapped Dialogflow intents and follow up intents for welcoming the user, collecting the ingredients, recommending the top recipes, listing missing ingredients, and reading out the final recipe. We enabled webhook calling for each intent so that we could use Fulfillment to generate a dynamic response to the users queries. We also defined Entities for the dish, dish ID, ingredient, and quantity so that we could extract useful data from queries. In order to train the NLP entity algorithms, we created and formatted a CSV file containing two columns of ingredient data. To recommend a recipe to the user after receiving a list of ingredients, we made a call to the Spoonacular API. We made calls to the API to find a recipe from ingredients, and display the instructions for making a recipe from a recipe ID. The API finds recipes that use as many of the given ingredients as possible and require as few additional ingredients as possible.

We have attached the index.js, package.json, and CSV training data file needed to build our chatbot in Dialogflow. 

Please email us with any questions on how to run this chatbot:
savinay@berkeley.edu,
shreyash2106@berkeley.edu,
pranavsukumar@berkeley.edu 

To use the bot, please visit the following link: https://recipe-bot.netlify.app/

If you want to interact with the bot in Google Assistant, please go to DialogFlow and sign in with this email: 
<br> Login: foodbotassistant@gmail.com <br /> 
P/W: foodbot2020 
