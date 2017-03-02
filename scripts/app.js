/*Features:
 1. I can see if FreeCodeCamp is currently streaming on twitch
 2. I can click on status update and go directly to the stream (if open)
 3. If a streamer is active, I can see details about the stream
 4. Can see a placeholder if the twitch stream was closed or never existed
 *5  cache and continuous refresh every 5 minutes
 *6. search function to add a stream to the list of streams; it caches in localstorage ...
 *7. remove function to remove streams from list
 *8. search and remove functions appear in modal pop-up
 Hint: See an example call to Twitch.tv's JSONP API at https://github.com/FreeCodeCamp/FreeCodeCamp/wiki/Front-End-Project-Use-Twitchtv-JSON-API.
 Hint: The relevant documentation about this API call is here: https://github.com/justintv/Twitch-API/blob/master/v3_resources/streams.md#get-streamschannel.
 Hint: Here's an array of the Twitch.tv usernames of people who regularly stream: ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"]
 Example Queries:
  search for streams:  https://api.twitch.tv/kraken/search/streams?q=starcraft
  get a channel: https://api.twitch.tv/kraken/channels/test_channel
*/
$("document").ready(function(){
 var apiBaseURL = 'https://wind-bow.gomix.me/twitch-api';
 var streams = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin"];
 var inactiveStreams = streams;
 var inactive = $("#display-inactive");
 var active = $("#display-active");
  // Utility function to set active buttons appearence and deactive previously
 // active button
  function activateBtn(button){

 } //end activateBtn
 // Set event handler for All button
 $(".nav-btn").on("click", function(){
   var status = $(this).attr('id');
   $(".nav-btn").removeClass("btn-active");
   $(this).addClass("btn-active");
   if(status === 'btn-all'){
     $("#display-active").removeClass("hidden");
     $("#display-inactive").removeClass("hidden");
     activateBtn($("#btn-all"));
   }
   else if (status === 'btn-live'){
     $("#display-active").removeClass("hidden");
     $("#display-inactive").addClass("hidden");
     activateBtn($("#btn-live"));
   }
   else if (status === 'btn-inactive'){
     $("#display-active").addClass("hidden");
     $("#display-inactive").removeClass("hidden");
     activateBtn($("#btn-inactive"));
   }
   else{ console.log("ERROR: what did you click?"); }
 });
 // Function to show stream data on the screen
 function showStream (stream, status){
   var streamImgURL = 'http://s.jtvnw.net/jtv_user_pictures/hosted_images/TwitchGlitchIcon_WhiteonPurple.png';
   switch(status){
     case 'active':
       streamHTML = "<div class='stream active'>";
       streamHTML += "<span class='stream-pic-container'><img class='stream-pic' src='"+ stream.channel.logo + "' alt='pic'></span>";
       streamHTML += "<span class='stream-name'><a href='" +  stream.channel.url  +"' target='_blank'>" + stream.channel.display_name + "</a></span>";
       streamHTML += "<span class='stream-status'>" + stream.channel.game + ": " + stream.channel.status + "</span></div>";
       active.append(streamHTML);
       break;
     case 'closed':
       streamHTML = "<div class='stream inactive'>";
       streamHTML += "<span class='stream-pic-container'><img class='stream-pic' src='"+ streamImgURL + "' alt='pic'></span>";
       streamHTML += "<span class='stream-name'>" + stream.display_name + "</span>";
       streamHTML += "<span class='stream-status'>" + status + "</span></div>";
       inactive.append(streamHTML);
       break;
     case 'inactive':
       streamHTML = "<div class='stream inactive'>";
       streamHTML += "<span class='stream-pic-container'><img class='stream-pic' src='"+ stream.logo + "' alt='pic'></span>";
       streamHTML += "<span class='stream-name'><a href='" +  stream.url  +"' target='_blank'>" + stream.display_name + "</a></span>";
       streamHTML += "<span class='stream-status'>" + status + "</span></div>";
       inactive.append(streamHTML);
       break;
     default:
       console.log("ERROR: invalid status passed to showStream");
   } //end of switch

 } //end showStreams
 function getChannelData(inactiveStreams){
   var stream;
   var apiURL = apiBaseURL + 'channels/';
    //loop through list of inactive streams and get channel data for each
    for(i = 0; i < inactiveStreams.length; i++){
       stream = inactiveStreams[i];
       $.getJSON(apiURL + stream + '?callback=?').success(function(data){
         console.log("streams channel object for: " + stream);
         console.log(data);
         showStream(data, 'inactive');
       }).fail(function(error){
         console.log("failed to get: " + stream);
         console.log(error);
         showStream({display_name: stream}, 'closed'); //##### This may not have stream name in it!
       });
     } //end of for loop
 } //end of getChnlStatus
 function getStreamData(streams){
   var apiURL = apiBaseURL + 'streams?channel=' + streams.join(',') + '?callback=?';
   var stream;
   //clear active and inactive displays before populating new data
   active.html = "";
   inactive.html = "";
   //get data
   $.getJSON(apiURL, function(data){
     //populate active stream data
     for(var i = 0; i < data.streams.length; i++){
       stream = data.streams[i].channel.display_name;
       //update inactive list
       inactiveStreams = inactiveStreams.filter(function(element, index, array){
         return stream != element;
       });
       showStream(data.streams[i], 'active');
     } //end for loop
     //populate inactive and closed stream data
     getChannelData(inactiveStreams);
   });
 }  // end of getStreamData
 //getStreamData(streams); //start the ball rolling


 /*The folowing works -
  I can use a for loop to go through the entire list and then call a render function
  for each returned object based on if it was succesful or not
   renderActiveStream(stream);
   renderInactiveStream(stream);
 */
 function test(streams){
   for(var i = 0; i < streams.length; i++){
     $.getJSON(apiBaseURL + '/channels/' + streams[i], function(data){
       console.log(data);
     });
   }
 }

 test(streams);

}); //end document.ready
     //# sourceURL=pen.js
