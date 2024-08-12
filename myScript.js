var players = [];
var originalPlayers = [];

// Shuffle function
function shuffle(players) {
    var m = players.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = players[m];
        players[m] = players[i];
        players[i] = t;
    }
    return players;
}

// Initialize the draft with the user input
document.getElementById("initializeDraft").addEventListener("click", function() {
    var input = document.getElementById("playerInput").value;
    players = input.split(',').map(player => player.trim()).filter(player => player.length > 0);
    if (players.length === 0) {
        alert('Please enter at least one player name.');
        return;
    }
    originalPlayers = [...players];
    shuffle(players);
    document.getElementById("remainder").innerHTML = players.length;
    document.getElementById("draftBoard").innerHTML = '';
    document.getElementById("draftStart").style.display = "inline";
    document.getElementById("draftPlayer").style.display = "none";
});

// Begin Default Draft Button
document.getElementById("draftStart").addEventListener("click", function() {
    document.getElementById("draftStart").style.display = "none";
    document.getElementById("draftPlayer").style.display = "inline";
});

// Draft a player
document.getElementById("draftPlayer").addEventListener("click", function() {
    if (players.length === 0) return;
    var newPlayer = players.pop();
    var newParagraph = document.createElement("p");
    newParagraph.textContent = newPlayer;
    document.getElementById("draftBoard").prepend(newParagraph);
    document.getElementById("remainder").innerHTML = players.length;
});