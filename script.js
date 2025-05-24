// Register a new user
document.getElementById('registerForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({ username, password, role, votes: [] });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful! You can now login.');
    window.location.href = 'login.html';
});

// Login user
document.getElementById('loginForm')?.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password && u.role === role);

    if (user) {
        localStorage.setItem('currentUser', username); // Store the current user
        if (role === 'admin') {
            window.location.href = 'admin.html'; // Redirect to admin dashboard
        } else {
            window.location.href = 'voter.html'; // Redirect to voter dashboard
        }
    } else {
        alert('Invalid credentials. Please try again.');
    }
});

// Create a new poll
document.getElementById('pollForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const pollTitle = document.getElementById('pollTitle').value;
    const pollOptions = document.getElementById('pollOptions').value.split(',');

    const polls = JSON.parse(localStorage.getItem('polls')) || [];
    polls.push({ title: pollTitle, options: pollOptions.map(option => ({ name: option.trim(), votes: 0 })) });
    localStorage.setItem('polls', JSON.stringify(polls));
    alert('Poll created successfully!');
});

// Load polls on castVote page
window.addEventListener('DOMContentLoaded', function () {
    const polls = JSON.parse(localStorage.getItem('polls')) || [];
    const pollsContainer = document.getElementById('polls');

    if (polls.length === 0) {
        pollsContainer.innerHTML = '<p>No polls available.</p>';
        return;
    }

    pollsContainer.innerHTML = ''; // Clear previous content
    polls.forEach(poll => {
        const pollDiv = document.createElement('div');
        pollDiv.classList.add('poll');
        pollDiv.innerHTML = `<h3>${poll.title}</h3>`;

        poll.options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.classList.add('poll-option');
            optionDiv.innerText = option.name;
            optionDiv.onclick = function () {
                vote(poll.title, option.name);
            };
            pollDiv.appendChild(optionDiv);
        });

        pollsContainer.appendChild(pollDiv);
    });
});


// Voting function
function vote(pollTitle, optionName) {
    const polls = JSON.parse(localStorage.getItem('polls')) || [];
    const poll = polls.find(p => p.title === pollTitle);

    if (!poll) {
        alert('Poll not found.');
        return;
    }

    const currentUsername = localStorage.getItem('currentUser');
    if (!currentUsername) {
        alert('No user is currently logged in. Please log in to vote.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = users.find(u => u.username === currentUsername);

    if (!currentUser) {
        alert('Current user not found. Please log in again.');
        return;
    }

    const option = poll.options.find(o => o.name === optionName);
    if (!option) {
        alert('Option not found.');
        return;
    }

    if (currentUser.votes.includes(pollTitle)) {
        alert('You have already voted in this poll.');
        return;
    }

    // Update the vote count
    option.votes += 1;
    currentUser.votes.push(pollTitle);

    // Save updated data to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('polls', JSON.stringify(polls));

    alert(`You voted for "${optionName}" in the poll "${pollTitle}"!`);
}
// Check votes for the currently logged-in user (for checkResults.html)
document.getElementById('checkVotesButton')?.addEventListener('click', function () {
    if (window.location.pathname.includes('checkResults.html')) { // Ensure this runs only on checkResults.html
        const currentUsername = localStorage.getItem('currentUser'); // Get the currently logged-in user
        if (!currentUsername) {
            alert('No user is currently logged in. Please log in to check your votes.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = users.find(u => u.username === currentUsername);

        const resultsContainer = document.getElementById('results'); // Correct container for displaying results
        resultsContainer.innerHTML = ''; // Clear previous results

        if (currentUser) {
            const userVotes = currentUser.votes;
            const polls = JSON.parse(localStorage.getItem('polls')) || [];

            if (userVotes.length === 0) {
                resultsContainer.innerHTML = `<p>You have not voted in any polls.</p>`;
                return;
            }

            userVotes.forEach(vote => {
                const poll = polls.find(p => p.title === vote);
                if (poll) {
                    const pollResultDiv = document.createElement('div');
                    pollResultDiv.classList.add('poll-result');
                    pollResultDiv.innerHTML = `<h3>${poll.title}</h3>`;

                    poll.options.forEach(option => {
                        const optionResultDiv = document.createElement('div');
                        optionResultDiv.classList.add('poll-option-result');
                        optionResultDiv.innerText = `${option.name}: ${option.votes} votes`;
                        pollResultDiv.appendChild(optionResultDiv);
                    });

                    resultsContainer.appendChild(pollResultDiv);
                }
            });
        } else {
            resultsContainer.innerHTML = `<p>Current user not found. Please log in again.</p>`;
        }
    }
});

// Check votes for a specific user (for checkVote.html)
document.getElementById('checkVotesButton')?.addEventListener('click', function () {
    if (window.location.pathname.includes('checkVotes.html')) { // Ensure this runs only on checkVote.html
        const username = document.getElementById('checkUsername').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username);

        const resultsContainer = document.getElementById('voteResults'); // Correct container
        resultsContainer.innerHTML = ''; // Clear previous results

        if (user) {
            const userVotes = user.votes;
            const polls = JSON.parse(localStorage.getItem('polls')) || [];

            if (userVotes.length === 0) {
                resultsContainer.innerHTML = `<p>${username} has not voted in any polls.</p>`;
                return;
            }

            userVotes.forEach(vote => {
                const poll = polls.find(p => p.title === vote);
                if (poll) {
                    const pollResultDiv = document.createElement('div');
                    pollResultDiv.classList.add('poll-result');
                    pollResultDiv.innerHTML = `<h3>${poll.title}</h3>`;

                    poll.options.forEach(option => {
                        const optionResultDiv = document.createElement('div');
                        optionResultDiv.classList.add('poll-option-result');
                        optionResultDiv.innerText = `${option.name}: ${option.votes} votes`;
                        pollResultDiv.appendChild(optionResultDiv);
                    });

                    resultsContainer.appendChild(pollResultDiv);
                }
            });
        } else {
            resultsContainer.innerHTML = `<p>User "${username}" not found.</p>`;
        }
    }
});

// Display overall results for admin
window.onload = function() {
    const polls = JSON.parse(localStorage.getItem('polls')) || [];
    const resultsContainer = document.getElementById('overallResults');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (polls.length === 0) {
        resultsContainer.innerHTML = '<p>No polls available.</p>';
        return;
    }

    polls.forEach(poll => {
        const pollResultDiv = document.createElement('div');
        pollResultDiv.classList.add('poll-result');
        pollResultDiv.innerHTML = `<h3>${poll.title}</h3>`;
        
        poll.options.forEach(option => {
            const optionResultDiv = document.createElement('div');
            optionResultDiv.classList.add('poll-option-result');
            optionResultDiv.innerText = `${option.name}: ${option.votes} votes`;
            pollResultDiv.appendChild(optionResultDiv);
        });
        
        resultsContainer.appendChild(pollResultDiv);
    });
};
function exportToCSV(filename) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const polls = JSON.parse(localStorage.getItem('polls')) || [];

    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Username,Role,Votes\n"; // Header for users
    users.forEach(user => {
        csvContent += `${user.username},${user.role},"${user.votes.join(';')}"\n`;
    });

    csvContent += "\nPoll Title,Option,Votes\n"; // Header for polls
    polls.forEach(poll => {
        poll.options.forEach(option => {
            csvContent += `${poll.title},${option.name},${option.votes}\n`;
        });
    });

    // Create a link to download the CSV
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "filename"
}