$(document).ready(function() {

var sAnimalArray = ["cats", "earthquake", "Lexus"]; var sMovieArray = ["Spotlight", "Titanic", "The Big Short"]; var sPeopleArray = ["obama", "federer", "trump"];   

var results; 	var iGiphyIndex = 0 ; 

var oObject = {

	queryAPI: function(sButtonType, sName) {
		//	console.log("gif button type= " + sButtonType + " sName= " + sName) ; 
		var queryURL = "" ;  var imgImage = "" ; 

		switch (sButtonType) {
			case "animal":
			case "person":

				queryURL = "https://api.giphy.com/v1/gifs/search?q=" + sName + "&api_key=dc6zaTOxFJmzC&limit=10";

				$.ajax({	
					url: queryURL,
					method: "GET"
				  })
				  .then(function(response) {
					  
						results = response.data ;	// results is GLOBAL
						
						console.log("response= ", response, "results= ", results);
						$("#main").empty() ; 
		
						for (var i = 0; i < results.length; i++) {  
							var tempDiv = $("<div class='column'>") ; 
							var pP = $("<p>").text("Rating: " + results[i].rating );  // pP.innerText = results[i].rating  DOES NOT work with JQ  
							imgImage =  $("<img>") ; 	
							//imgImage.attr("src", results[i].images.fixed_height.url); // set image src to ANIMATE
							imgImage.attr("src", results[i].images.fixed_height_still.url) ; // set image src to STILL
							// add attr state = still
							imgImage.attr("data-state", "still") ;
							
							iGiphyIndex = i ;  // iGiphyIndex is GLOBAL
							imgImage.attr("data-index", iGiphyIndex) ;

							tempDiv.append(imgImage) ; 	// append image variable to the tempDiv variable.
							tempDiv.append(pP) ;          // append pP variable to the tempDiv 
							$("#main").append(tempDiv) ; // Prepend the animalDiv variable to the element with an id of gifs-appear-here.
						} //end for 
					}); // end .then
			break ; 

			case "movie":
				queryURL = "https://www.omdbapi.com/?t=" + sName + "&y=&plot=short&apikey=trilogy"; 
				$.ajax({
					url: queryURL,
					method: "GET"
				  }).then(function(response) {
		  
					//console.log("movie-response= ", response) ;
					
					$("#main").empty() ; 

					var tempDiv1 = $("<div class='col-lg-3'>") ;
					tempDiv1.append($("<h4>").text(response.Title));
					tempDiv1.append($("<p>").text("Starring: " + response.Actors));
					tempDiv1.append($("<p>").text(response.Awards));
					tempDiv1.append($("<p>").text("Released: " + response.Released));
					tempDiv1.append($("<p>").text("Rating: " + response.Rated));

					var tempDiv2 = $("<div class='col-lg-5'>") ;
					var image = $("<img>").attr("src", response.Poster);
					tempDiv2.append(image); 
					
					var tempDiv3 = $("<div class='col-lg-3'>") ;
					tempDiv3.append($("<p>").text(response.Plot));
					
					var sURL = response.Website;   
					var sLink = sURL.link(sURL); 
					tempDiv3.append($("<p>").html(sLink));
					console.log("sLink= ", sLink, "sURL=", sURL);
					// append "target='_blank'" ;
					
					tempDiv3.append($("<p>").text("Screenplay: " + response.Writer));

					$("#main").append(tempDiv1) ;
					$("#main").append(tempDiv2) ;
					$("#main").append(tempDiv3) ;
				});
			break;
		
		/*	// person APY for future reference  	
			case "person":
				queryURL = "" ;
				break; */
		} // end switch
	} , // end queryAPI

	// check NEW buttons
	ValidateAndCreateButtons: function(sButtonType, sName) {

		//var sButtonType = $(this).attr("value") ;  // why does this not work and must PASS in ?? 
		
		var bProceed = true ;  var appendDiv = "" ;  var sArrayName = "" ;  var iIndex = 0; // var sName = "";  
		switch (sButtonType) {
			case "animal":
				sName = $("#animal-text").val();  sArrayName = sAnimalArray ;  appendDiv = "#animal-buttons" ; 
			break ; 
			case "movie":
				sName = $("#movie-text").val();	  sArrayName = sMovieArray ;	appendDiv = "#movie-buttons" ;
			break;
			case "person":
				sName = $("#person-text").val();  sArrayName = sPeopleArray ;	 appendDiv = "#person-buttons" ; 
			break;
		} // end switch

		if (sName.length < 1 ) {
			bProceed = false ;
			alert ("Giphy Must be NEW and Not Blank!") ;
		}
		else { // check for existense 
			for (iIndex = 0; iIndex < sArrayName.length; iIndex++) { 
				if (sName == sArrayName[iIndex]) {
					bProceed = false ; 
					alert("NEW Giphy Subjects ONLY!") ;
					break ;
				} // end if 
			} // end for  				
		} // end else

		if (bProceed) {
			sArrayName.push(sName) ;
			var newBtn = $("<button>");
			newBtn.addClass("btn-sm"); newBtn.attr("type", sButtonType); newBtn.attr("name", sName);	
			newBtn.text(sName);	$(appendDiv).append(newBtn); 	
			oObject.queryAPI(sButtonType, sName) ;
		} // end exists	
			
	} , // end newButtons
	  
	// initialize buttons
	initButtons: function() {

		var sButtonTypeArr = ["animal", "movie", "person"] ;	
		var sDivArray = ["#animal-buttons", "#movie-buttons", "#person-buttons"] ;
		var sNameArray = [sAnimalArray,  sMovieArray, sPeopleArray] ; 
		// console.log(sNameArray) ;

		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				var newBtn = $("<button>");	
				newBtn.addClass("btn-sm");
				newBtn.attr("type", sButtonTypeArr[i]); 
				newBtn.attr("name", sNameArray[i][j]); 
				newBtn.text(sNameArray[i][j]);	
				$(sDivArray[i]).append(newBtn); 
			} //end j 
		} // end i
	} , // end initButtons

} ; // end oObject

// initialze some giphy buttons 
oObject.initButtons();
oObject.queryAPI("animal", "dogs") ;

// trap new giphy info 
$(".btn").on("click", function(event) {		// TAB event
	event.preventDefault();					// TAB event.preventDefault();
	var sButtonType = $(this).attr("value") ;	//why NOT WORK in object function 
	var sName = "" ; 
	
	//MAX TAs > is there a better way to do this other than a separate id on each input?
	switch (sButtonType) {
		case "animal": sName = $("#animal-text").val(); break ; 
		case "movie": sName = $("#movie-text").val(); break;
		case "person": sName = $("#person-text").val(); break;
	} // end switch
	oObject.ValidateAndCreateButtons(sButtonType, sName);	//MUST PASS to object.function 
}); 

// display giphy 
$(document).on('click','.btn-sm',function() { // $(".btn-sm").on("click", function() {} DOES NOT WORK FOR NEW DYNAMIC BUTTONS
	var sButtonType = $(this).attr("type") ;
	var sName = $(this).attr("name") ;
	oObject.queryAPI(sButtonType, sName) ;
  });

 //$(".gif").on("click", function() {  NOTE if selector = .gif  // $("img").on("click", function() { 
 $(document).on('click','img',function() {
	var sState = $(this).attr("data-state") ;
	var iIndex = $(this).attr("data-index") ; 
	//console.log("inside image= ", $("img"), "sState=", sState) ;

	if (sState === "still") { 
		$(this).attr("src", results[iIndex].images.fixed_height.url); // set image src to ANIMATE
		$(this).attr("data-state", "animate") ;
	}
	
	if (sState === "animate") {
		$(this).attr("src", results[iIndex].images.fixed_height_still.url); // set image src to STILL
		$(this).attr("data-state", "still");
	}
	
	/*  if (state === "still") {
		  $(this).attr("src", $(this).attr("data-animate"));
		  $(this).attr("data-state", "animate");
		} 	
		else if (state === "animate") {
		$(this).attr("src", $(this).attr("data-still"));
		$(this).attr("data-state", "still");
	  } 	*/
  }); // end slick img
}); // end doc ready

