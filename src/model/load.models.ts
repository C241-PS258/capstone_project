import { BadRequestException } from '@nestjs/common';
import * as tfjs from '@tensorflow/tfjs-node';

// const tfjs = require('@tensorflow/tfjs-node');
// const { nodeFileSystemRouter } = require('@tensorflow/tfjs-node/dist/io/file_system');

async function loadModel() {
    const modelUrl = "https://storage.googleapis.com/aquaculture_mate-bucket/model-machine_learning/tfjs-model/model.json";
    // const modelUrl = "file://data_model/model.json";
    // const modelUrl = "https://storage.googleapis.com/aquaculture_mate-bucket/model-machine_learning/model.json";
    console.log('ini model');
    return tfjs.loadLayersModel(modelUrl);
}


function predict(model, imageBuffer) {
    const tensor = tfjs.node
        .decodeJpeg(imageBuffer)
        .resizeNearestNeighbor([150, 150])
        .expandDims()
        .toFloat();

    return model.predict(tensor).data();
}

async function predictClassification(model, image) {
    try {
        const tensor = tfjs.node.decodeJpeg(image.data).resizeNearestNeighbor([224, 224]).expandDims().toFloat();

        const prediction = await model.predict(tensor);
        const scores = await prediction.data();

        const maxScoreIndex = scores.indexOf(Math.max(...scores));
        console.log("maxScoreIndex", maxScoreIndex);

        let label, suggestion;

        if (maxScoreIndex === 0) {
            label = "Ikan Gabus";
            suggestion = "Selamat, Anda memprediksi ikan Gabus!";
        } else if (maxScoreIndex === 1) {
            label = "Ikan Mas";
            suggestion = "Selamat, Anda memprediksi ikan Mas!";
        } else if (maxScoreIndex === 2) {
            label = "Ikan Lele";
            suggestion = "Selamat, Anda memprediksi ikan Lele!";
        } else if (maxScoreIndex === 3) {
            label = "Ikan Nila";
            suggestion = "Selamat, Anda memprediksi ikan nila!";
        } else if (maxScoreIndex === 4) {
            label = "Ikan Patin";
            suggestion = "Selamat, Anda memprediksi ikan Patin!";
        } else {
            label = "Tidak Diketahui";
            suggestion = "Hasil prediksi tidak dapat diinterpretasikan.";
        }

        return { label, suggestion };
    } catch (error) {
        throw new BadRequestException(`Terjadi kesalahan input: ${error.message}`);
    }
}


// async function predictClassification(model, image) {
//     try {
//         // Decode JPEG image, resize, and expand dimensions
//         const tensor = tfjs.node.decodeJpeg(image.data).resizeNearestNeighbor([224, 224]).expandDims().toFloat();

//         // Normalize pixel values to range [0, 1]
//         const normalizedTensor = tensor.div(255.0);

//         // Predict the class probabilities
//         const prediction = model.predict(normalizedTensor);

//         // Retrieve the scores from the prediction
//         const scores = await prediction.data();

//         // Define labels for each class
//         const labels = ["lele", "gabus", "mas", "nila"];

//         // Find the index of the highest score
//         const maxScoreIndex = scores.indexOf(Math.max(...scores));

//         // Get the corresponding label
//         const label = labels[maxScoreIndex];
//         console.log("labels", label);


//         // Provide a suggestion based on the label
//         let suggestion;
//         switch (label) {
//             case "lele":
//                 suggestion = "Ini adalah ikan lele.";
//                 break;
//             case "gabus":
//                 suggestion = "Ini adalah ikan gabus.";
//                 break;
//             case "mas":
//                 suggestion = "Ini adalah ikan mas.";
//                 break;
//             case "nila":
//                 suggestion = "Ini adalah ikan nila.";
//                 break;
//             default:
//                 suggestion = "Tidak dapat mengenali jenis ikan.";
//         }

//         return { label, suggestion };
//     } catch (error) {
//         throw new BadRequestException(`Terjadi kesalahan input: ${error.message}`);
//     }
// }

// async function predictClassification(model, image) {
//     try {
//         // Mengubah data gambar menjadi tensor
//         const tensor = tfjs.node.decodeImage(image.data).resizeNearestNeighbor([224, 224]).expandDims().toFloat();

//         // Melakukan prediksi menggunakan model
//         const predictions = await model.predict(tensor).data();

//         // Mendapatkan kelas dengan probabilitas tertinggi
//         const predictedClassIndex = predictions.indexOf(Math.max(...predictions));

//         // Mengembalikan hasil prediksi
//         let predictedClass;
//         switch (predictedClassIndex) {
//             case 0:
//                 predictedClass = "Ikan Lele";
//                 break;
//             case 1:
//                 predictedClass = "Ikan Gabus";
//                 break;
//             case 2:
//                 predictedClass = "Ikan Mas";
//                 break;
//             case 3:
//                 predictedClass = "Ikan Nila";
//                 break;
//             default:
//                 predictedClass = "Kelas tidak dikenali";
//                 break;
//         }

//         return predictedClass;
//     } catch (error) {
//         throw new Error(`Terjadi kesalahan dalam melakukan prediksi: ${error.message}`);
//     }
// }



export { loadModel, predict, predictClassification }