// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
const axios = require('axios'); 
const unirest = require('unirest');
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');


process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  var dict = {};  
  var id = 0;
  function IngredientsHandler(agent) {
    const ingredients = agent.parameters.ingredient;
    const API_KEY = "24e3e8dad0be44d6a09d8c63f72dcb4f";
    let x = 1;
    let returnText = "";
    agent.add('Here are the 3 best dishes using your ingredients: ');
    return axios.get(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredients}&number=3&ranking=1&ignorePantry=true`)
    .then((result) => {
      console.log(JSON.stringify(result.data));
	  result.data.map(titleObj => {
        let missedIngreds = "";
        dict[x] = titleObj;
        console.log(dict[x].title);
        returnText += "Dish " + x + ": "; 
        returnText += dict[x].title + "." + "          ";
        x += 1;
      });
      returnText += "              Choose option one, two, three, or neither. ";
      agent.add(returnText);
      const contexts = {'name': 'ingredient', 'lifespan': 1, 'parameters': {'ingredient': ingredients}};
      agent.context.set(contexts);
    });
  }
  
  function RecipeHandler(agent){
    let choice = agent.parameters.dish;
	switch(choice) {
    	case 'one': choice = 1; 
       	   break;
        case 'two': choice = 2;
     	   break;
     	case 'three': choice = 3;
     	   break;
        case 'neither' : 
       	   agent.add("Please visit www.feedingamerica.org/find-your-local-foodbank to find the nearest food bank to donate the food items to.");
           choice = 0;
           break; 
    }
    console.log(choice);
    console.log(typeof choice);
    var x = 1;
    const ingredients = agent.parameters.ingredient;
    console.log(ingredients);
    const API_KEY = "24e3e8dad0be44d6a09d8c63f72dcb4f";
    return axios.get(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredients}&number=3&ranking=1&ignorePantry=true`)
    .then((result) => {
      console.log(JSON.stringify(result.data));
      let missedIngreds = "";
	  result.data.map(titleObj => {
        if (Number(x) == choice){
          	console.log(titleObj.id);
          	console.log(typeof titleObj.id);
            id = titleObj.id;
        	Object.values(titleObj.missedIngredients).map(ingObj => {
          		missedIngreds += ingObj.originalName + ", ";
        	});
          	missedIngreds = missedIngreds.substring(0, missedIngreds.length - 2) + ".";
      		agent.add("To make this dish you will also need: " + missedIngreds + " Say continue to get the recipe instructions.");
            const contexts = {'name': 'id', 'lifespan': 1, 'parameters': {'id': id}};
		    agent.context.set(contexts);
        }
        x += 1;
      });
    });
  }

  function followUp(agent) {
    const id = agent.parameters.id;
    const API_KEY = "24e3e8dad0be44d6a09d8c63f72dcb4f";
    let steps = "";
    let steps2 = "";
    return axios.get(`https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${API_KEY}`)
    .then((result) => {
      console.log(JSON.stringify(result.data));
      result.data.map(Obj => {
      Object.values(Obj.steps).map(stepsObj => {
        	if(steps.length < 640) {
        		steps += "Step" + stepsObj.number + " :  " + stepsObj.step.replace(" F ", "Fahrenheit") + "..      	 ";
            } else if(steps2.length < 640) {
                steps2 += "Step" + stepsObj.number + " :  " + stepsObj.step.replace(" F ", "Fahrenheit") + "..      	 ";
            }
        });   
      });
      console.log(steps);
      console.log(steps2);
      agent.add(steps);
      if (steps2 != "") {
      	agent.add(steps2);
      }
    });
  }
  
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Ingredients', IngredientsHandler);
  intentMap.set('Recipe', RecipeHandler);
  intentMap.set('followUp', followUp);
  agent.handleRequest(intentMap);
});
