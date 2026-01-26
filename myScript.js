var players = [];
var originalPlayers = [];
var draftedPlayers = [];

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

// Save draft state to localStorage
function saveDraftState() {
    var draftState = {
        players: players,
        originalPlayers: originalPlayers,
        draftedPlayers: draftedPlayers,
        timestamp: new Date().getTime()
    };
    localStorage.setItem('fantasyDraftState', JSON.stringify(draftState));
}

// Load draft state from localStorage
function loadDraftState() {
    var savedState = localStorage.getItem('fantasyDraftState');
    if (savedState) {
        return JSON.parse(savedState);
    }
    return null;
}

// Clear draft state from localStorage
function clearDraftState() {
    localStorage.removeItem('fantasyDraftState');
}

// Restore the draft UI
function restoreDraft(state) {
    players = state.players;
    originalPlayers = state.originalPlayers;
    draftedPlayers = state.draftedPlayers;
    
    // Update the UI
    document.getElementById("remainder").innerHTML = players.length;
    
    // Restore drafted players to the board
    var draftBoard = document.getElementById("draftBoard");
    draftBoard.innerHTML = '';
    draftedPlayers.forEach(function(player) {
        var newParagraph = document.createElement("p");
        newParagraph.textContent = player;
        draftBoard.appendChild(newParagraph);
    });
    
    // Set button visibility based on state
    if (draftedPlayers.length > 0) {
        // Draft is in progress
        document.getElementById("draftStart").style.display = "none";
        document.getElementById("draftPlayer").style.display = "inline";
    } else {
        // Draft initialized but not started
        document.getElementById("draftStart").style.display = "inline";
        document.getElementById("draftPlayer").style.display = "none";
    }
}

// Check for saved draft on page load
window.addEventListener('load', function() {
    var savedState = loadDraftState();
    if (savedState) {
        // Show prompt to resume
        var resume = confirm("A previous draft was found. Do you want to resume where you left off?\n\nClick OK to resume or Cancel to start fresh.");
        if (resume) {
            restoreDraft(savedState);
        } else {
            clearDraftState();
        }
    }
});

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
    draftedPlayers = [];
    
    document.getElementById("remainder").innerHTML = players.length;
    document.getElementById("draftBoard").innerHTML = '';
    document.getElementById("draftStart").style.display = "inline";
    document.getElementById("draftPlayer").style.display = "none";
    
    // Save the initial state
    saveDraftState();
});

// Begin Default Draft Button
document.getElementById("draftStart").addEventListener("click", function() {
    document.getElementById("draftStart").style.display = "none";
    document.getElementById("draftPlayer").style.display = "inline";
    saveDraftState();
});

// Draft a player
document.getElementById("draftPlayer").addEventListener("click", function() {
    if (players.length === 0) return;
    var newPlayer = players.pop();
    draftedPlayers.unshift(newPlayer); // Add to beginning of drafted array
    
    var newParagraph = document.createElement("p");
    newParagraph.textContent = newPlayer;
    document.getElementById("draftBoard").prepend(newParagraph);
    document.getElementById("remainder").innerHTML = players.length;
    
    // Save state after each draft
    saveDraftState();
    
    // Clear state if draft is complete
    if (players.length === 0) {
        setTimeout(function() {
            alert('Draft complete! All players have been selected.');
            clearDraftState();
        }, 100);
    }
});

// Handle "New Draft" link in navbar
document.querySelector('.navbar-nav a[href=""]').addEventListener('click', function(e) {
    e.preventDefault();
    var confirmNew = confirm('Are you sure you want to start a new draft? This will clear the current draft.');
    if (confirmNew) {
        clearDraftState();
        location.reload();
    }
});
