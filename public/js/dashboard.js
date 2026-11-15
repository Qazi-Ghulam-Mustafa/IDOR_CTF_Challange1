
const usernameElement = document.getElementById('username');
const emailElement = document.getElementById('userEmail');
const documentsList = document.getElementById('documentsList');
const challengesList = document.getElementById('challengesList');
const logoutBtn = document.getElementById('logoutBtn');

// Progress card elements
const totalChallengesElement = document.getElementById('totalChallenges');
const completedChallengesElement = document.getElementById('completedChallenges');
const remainingChallengesElement = document.getElementById('remainingChallenges');

// Load dashboard information
async function loadDashboard() {
    try {
        const response = await fetch('/api/dashboard');

        if (response.status === 401) {
            window.location.href = '/';
            return;
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Dashboard loading failed');
        }

        usernameElement.textContent = data.user.username;
        emailElement.textContent = data.user.email;

        documentsList.innerHTML = '';

        if (data.documents.length === 0) {
            documentsList.textContent = 'No documents available.';
        } else {
            data.documents.forEach((doc) => {
                const item = document.createElement('div');
                item.textContent = doc.title;
                documentsList.appendChild(item);
            });
        }

        await loadChallenges();

    } catch (error) {
        console.error('Dashboard error:', error);
    }
}

// Load challenges and calculate progress
async function loadChallenges() {
    try {
        const response = await fetch('/api/challenges');

        if (response.status === 401) {
            window.location.href = '/';
            return;
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Unable to load challenges');
        }

        // Calculate challenge progress
        const total = data.challenges.length;

        const completed = data.challenges.filter(
            (challenge) => Number(challenge.completed) === 1
        ).length;

        const remaining = total - completed;

        // Update progress cards
        totalChallengesElement.textContent = total;
        completedChallengesElement.textContent = completed;
        remainingChallengesElement.textContent = remaining;

        challengesList.innerHTML = '';

        data.challenges.forEach((challenge) => {
            const card = document.createElement('div');
            card.className = 'challenge-card';

            const title = document.createElement('h3');
            title.textContent = challenge.title;

            const description = document.createElement('p');
            description.textContent = challenge.description;

            const status = document.createElement('p');
            status.textContent = challenge.completed
                ? 'Completed'
                : 'Not Completed';

            const hint = document.createElement('p');
            hint.textContent = `Hint: ${challenge.hint}`;

            card.append(title, description, status, hint);

            if (!challenge.completed) {
                const form = document.createElement('form');

                const flagInput = document.createElement('input');
                flagInput.type = 'text';
                flagInput.placeholder = 'Enter your flag';
                flagInput.required = true;

                const submitButton = document.createElement('button');
                submitButton.type = 'submit';
                submitButton.textContent = 'Submit Flag';

                const message = document.createElement('p');

                form.append(flagInput, submitButton, message);

                form.addEventListener('submit', async (event) => {
                    event.preventDefault();

                    try {
                        const flagResponse = await fetch(
                            `/api/challenges/${encodeURIComponent(challenge.slug)}/submit`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    flag: flagInput.value
                                })
                            }
                        );

                        const flagData = await flagResponse.json();

                        message.textContent = flagData.message;

                        if (flagData.success) {
                            message.style.color = 'green';
                            await loadChallenges();
                        } else {
                            message.style.color = 'red';
                        }

                    } catch (error) {
                        console.error('Flag submission error:', error);
                        message.textContent = 'Something went wrong.';
                    }
                });

                card.appendChild(form);
            }

            challengesList.appendChild(card);
        });

    } catch (error) {
        console.error('Challenges error:', error);
    }
}

// Logout
logoutBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST'
        });

        if (response.ok) {
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
});

// Start dashboard
loadDashboard();
