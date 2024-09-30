let dataPoints = [];
let centroids = [];
let clusters = [];
let maxIterations = 100; // Limit the iterations to avoid infinite loops
let currentIteration = 0;

// Generate a random dataset
function generateDataset() {
    dataPoints = [];
    for (let i = 0; i < 300; i++) {
        dataPoints.push([Math.random() * 20 - 10, Math.random() * 20 - 10]);
    }
    plotData();  // Call to plot the data
}

// Initialize Centroids
function initializeCentroids(k, method) {
    centroids = [];

    if (method === 'random') {
        // Random initialization
        for (let i = 0; i < k; i++) {
            let randomPoint = dataPoints[Math.floor(Math.random() * dataPoints.length)];
            centroids.push([...randomPoint]);
        }
    } else if (method === 'kmeans++') {
        // KMeans++ initialization
        const firstCentroidIndex = Math.floor(Math.random() * dataPoints.length);
        centroids.push([...dataPoints[firstCentroidIndex]]); // Pick the first centroid randomly

        for (let i = 1; i < k; i++) {
            const distances = dataPoints.map(point => {
                return Math.min(...centroids.map(centroid => euclideanDistance(point, centroid)));
            });

            const totalDistance = distances.reduce((acc, val) => acc + val ** 2, 0);
            const probabilities = distances.map(distance => (distance ** 2) / totalDistance);
            const cumulativeProbabilities = probabilities.reduce((acc, prob) => {
                acc.push((acc[acc.length - 1] || 0) + prob);
                return acc;
            }, []);

            const rand = Math.random();
            for (let j = 0; j < cumulativeProbabilities.length; j++) {
                if (rand <= cumulativeProbabilities[j]) {
                    centroids.push([...dataPoints[j]]);
                    break;
                }
            }
        }
    } else if (method === 'farthest') {
        // Farthest First initialization
        const firstCentroidIndex = Math.floor(Math.random() * dataPoints.length);
        centroids.push([...dataPoints[firstCentroidIndex]]); // Pick the first centroid randomly

        while (centroids.length < k) {
            const distances = dataPoints.map(point => {
                return Math.min(...centroids.map(centroid => euclideanDistance(point, centroid)));
            });

            const farthestPointIndex = distances.indexOf(Math.max(...distances));
            centroids.push([...dataPoints[farthestPointIndex]]); // Add the point that is farthest from existing centroids
        }
    } else if (method === 'manual') {
        // Manual selection
        console.log("Manual centroid selection: Click on the plot to set centroids");
        // Implement event listener for manual selection if required
    }

    plotData(); // Plot centroids as well
}


// Assign points to nearest centroid
function assignClusters() {
    clusters = [];
    for (let i = 0; i < centroids.length; i++) {
        clusters[i] = [];
    }
    dataPoints.forEach(point => {
        let distances = centroids.map(centroid => euclideanDistance(point, centroid));
        let clusterIndex = distances.indexOf(Math.min(...distances));
        clusters[clusterIndex].push(point);
    });
}

// Update centroid positions
function updateCentroids() {
    let newCentroids = centroids.map((centroid, i) => {
        let cluster = clusters[i];
        if (cluster.length === 0) return centroid; // Avoid empty clusters

        let newCentroid = cluster.reduce((acc, point) => {
            return [acc[0] + point[0], acc[1] + point[1]];
        }, [0, 0]).map(val => val / cluster.length);
        return newCentroid;
    });

    let centroidShift = centroids.some((centroid, i) => {
        return euclideanDistance(centroid, newCentroids[i]) > 0.001; // Minimal movement threshold
    });

    centroids = newCentroids;
    return centroidShift;
}

// Calculate Euclidean distance between two points
function euclideanDistance(point1, point2) {
    return Math.sqrt((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2);
}

// Plot the data using Plotly.js
function plotData() {
    let traceData = {
        x: dataPoints.map(point => point[0]),
        y: dataPoints.map(point => point[1]),
        mode: 'markers',
        type: 'scatter',
        marker: { size: 6 }
    };

    let traceCentroids = {
        x: centroids.map(centroid => centroid[0]),
        y: centroids.map(centroid => centroid[1]),
        mode: 'markers',
        type: 'scatter',
        marker: { size: 12, color: 'red' }
    };

    let layout = {
        title: 'KMeans Clustering Data',
        xaxis: { range: [-10, 10] },
        yaxis: { range: [-10, 10] }
    };

    Plotly.newPlot('plot', [traceData, traceCentroids], layout);
}

// Handle Full KMeans Iterations
function runKMeans(k, method, converge) {
    currentIteration = 0;
    initializeCentroids(k, method); // Pass the method to initialize centroids
    if (converge) {
        stepThroughKMeans(); // If we want to run to convergence
    } else {
        // Just step through one iteration
        assignClusters();
        updateCentroids();
        plotData();
    }
}

// Step through KMeans iteration until convergence or max iterations
function stepThroughKMeans() {
    if (currentIteration >= maxIterations) {
        console.log("Reached max iterations");
        return;
    }

    assignClusters();
    let centroidShifted = updateCentroids(); // Update centroids based on current clusters
    plotData(); // Update the plot

    currentIteration++;

    // Continue if centroids shifted
    if (centroidShifted) {
        setTimeout(stepThroughKMeans, 500); // Slow down the iteration for visualization
    } else {
        console.log("K-Means converged");
        alert("K-Means has converged!");
    }
}


// Event Listeners for buttons
document.getElementById('step').addEventListener('click', () => {
    const k = parseInt(document.getElementById('clusters').value);
    const method = document.getElementById('initialization').value;
    runKMeans(k, method, false); // Step through the KMeans without running to convergence
});

document.getElementById('converge').addEventListener('click', () => {
    const k = parseInt(document.getElementById('clusters').value);
    const method = document.getElementById('initialization').value;
    runKMeans(k, method, true); // Run to convergence
});

document.getElementById('generate').addEventListener('click', generateDataset);

document.getElementById('reset').addEventListener('click', () => {
    centroids = [];
    clusters = [];
    currentIteration = 0;
    plotData(); // Reset plot
});

// On page load
generateDataset();
