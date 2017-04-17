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
 var DEFAULT_LOGO = 'http://s.jtvnw.net/jtv_user_pictures/hosted_images/TwitchGlitchIcon_WhiteonPurple.png';
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
 function getStreamData(streams){
   for(var i = 0; i < streams.length; i++){
     (function(){
       var channelName = streams[i];
       var channelData;
       $.getJSON(apiBaseURL + '/streams/' + streams[i] + '?callback=?', function(streamData){
         console.log(streamData);
         //test to see if stream is active
         if(streamData.stream){
           console.log('stream is active');
           renderActiveStream(streamData.stream);
         }
         //stream not active, so need to get channel data and check to see if channel still active
         else{
           $.getJSON(apiBaseURL + '/channels/' + channelName + '?callback=?', function(channelData){
             console.log(channelData);
             if(channelData.error){
               console.log('channel does not exist');
               renderClosedStream(channelData, channelName);
             }
             //channel streams are just inactive
             else{
                renderInactiveStream(channelData);
                console.log('channel stream is inactive');
             }
           });
         }
       });//end of .getJSON
     })();  //end of wrapper function
   } //end of for loop
 }
 function renderActiveStream(stream){
   var streamHTML = "<div class='stream active'>";
   if(!stream.channel.logo){ stream.channel.logo = DEFAULT_LOGO;  }
   if(!stream.channel.status) { stream.channel.status = "None Available"; }
   streamHTML += "<span class='stream-pic-container'><img class='stream-pic' src='"+ stream.channel.logo + "' alt='pic'></span>";
   streamHTML += "<span class='stream-name'><a href='" +  stream.channel.url  +"' target='_blank'>" + stream.channel.display_name + "</a></span>";
   streamHTML += "<span class='stream-status'>" + stream.channel.game + ": " + stream.channel.status + "</span></div>";
   active.append(streamHTML);
 }
 function renderInactiveStream(stream){
   var streamHTML = "<div class='stream inactive'>";
   if(!stream.logo){ stream.logo = DEFAULT_LOGO;  }
   if(!stream.status) { stream.status = "None Available"; }
   streamHTML += "<span class='stream-pic-container'><img class='stream-pic' src='"+ stream.logo + "' alt='pic'></span>";
   streamHTML += "<span class='stream-name'><a href='" +  stream.url  +"' target='_blank'>" + stream.display_name + "</a></span>";
   streamHTML += "<span class='stream-status'>" + stream.status + "</span></div>";
   inactive.append(streamHTML);
 }
 function renderClosedStream(stream, name){
   var streamImgURL = DEFAULT_LOGO;
   var streamHTML = "<div class='stream inactive'>";
   streamHTML += "<span class='stream-pic-container'><img class='stream-pic' src='"+ streamImgURL + "' alt='pic'></span>";
   streamHTML += "<span class='stream-name'>" + name + "</span>";
   streamHTML += "<span class='stream-status'>CLOSED</span></div>";
   inactive.append(streamHTML);
 }
 
//start the whole thing rolling
getStreamData(streams);

}); //end document.ready
     //# sourceURL=pen.js
