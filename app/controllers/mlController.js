const { Parser } = require("json2csv");
const fs = require("fs");
const _ = require("lodash");
const { spawn } = require("child_process"),
  spawnSync = require("child_process").spawnSync,
  exec = require("child_process").exec;
const path = require("path");
const process = [];
exports.get_process = (req, res, next) => {
  return res.status(200).json({ message: "Machine Learning is runing." });
};
exports.running = (req, res, next) => {
  let { disease_id, label } = req.body;
  console.log(disease_id);
  let index = process.findIndex((process_running) => {
    if (process_running) return process_running.id_process == disease_id;
  });
  console.log(index);

  if (index == -1) {
    process.push({
      func: run_python(label, disease_id),
      id_process: disease_id,
      count: 1,
    });
  } else {
    console.log("kill port:" + disease_id);
    process[index].func.kill();
    let count = process[index].count++;
    delete process[index];
    process.push({
      func: run_python(label, disease_id),
      id_process: disease_id,
      count,
    });
  }

  return res.status(200).json({ message: "running" });
};
exports.create = (req, res, next) => {
  let { from, disease_id, label } = req.body;
  console.log("from", from);
  console.log("label", label);
  console.log("__dirname", __dirname);
  // let choice = JSON.parse(
  //   JSON.stringify(cartesianProduct(from), null, 4)
  // );
  // const pre_csv = add_answer_in_choice(choice, answer);
  // let count_choice = from.length;
  // const label = create_label(count_choice);
  let ready_csv = arr_to_json(from, label);
  create_csv(ready_csv, label, disease_id);
  let index = process.findIndex((process_running) => {
    if (process_running) return process_running.id_process == disease_id;
  });
  console.log(index);

  if (index == -1) {
    process.push({
      func: run_python(label, disease_id),
      id_process: disease_id,
      count: 1,
    });
  } else {
    console.log("kill port:" + disease_id);
    process[index].func.kill();
    let count = process[index].count++;
    delete process[index];
    process.push({
      func: run_python(label, disease_id),
      id_process: disease_id,
      count,
    });
  }

  return res.status(200).json({ message: "running" });
};
const create_csv = (ready_csv, label, disease_id) => {
  const parser = new Parser({
    fields: label,
    unwind: label,
  });
  console.log(path.join(__dirname, "../../"));
  const csv = parser.parse(ready_csv);
  // spawnSync('del', ['-rf'].concat(toDelete));
  // let pathMain = path.join(__dirname, "../../") 
  
  // spawnSync('del', [`${path.join(__dirname, "../../")}\\data\\file3.csv`]);
  // exec(`rm file${disease_id}.csv`, { cwd: path.join(__dirname, "../../data") } /* ... */);
  // spawn(`rm`, [`${path.join(__dirname, "../../")}/data/file${disease_id}.csv`]);
  fs.writeFile(
    `${path.join(__dirname, "../../")}/data/file${disease_id}.csv`,
    csv,
    function (err) {
      if (err) throw err;
      console.log(`file${disease_id}.csv saved`);
    }
  );
};
const cartesianProduct = (arr) => {
  console.log(arr);

  return arr.reduce(
    (a, b) => {
      return a
        .map((x) => {
          return b.map((y) => {
            return x.concat([y]);
          });
        })
        .reduce((a, b) => {
          return a.concat(b);
        }, []);
    },
    [[]]
  );
};
const add_answer_in_choice = (choices, answer) => {
  return choices.map((choice) => {
    return [...choice, answer];
  });
};
const create_label = (count) => {
  let name = "choice";
  let label = [];
  for (let i = 1; i <= count; i++) {
    label.push(name + i);
  }
  label.push("answer");
  return label;
};
const arr_to_json = (pre_csv, label) =>
  pre_csv.map((v) => _.zipObject(label, v));

const run_python = (label, disease_id) => {
  const python = spawn("python3", ["index.py"]);
  // const python = spawn("python", ["index.py"]);
  label.pop();
  let data = [label, disease_id];
  let label_buf = Buffer.from(JSON.stringify(data));

  python.stdin.write(label_buf);
  python.stdin.end();

  python.stdout.on("data", (data) => {
    console.log("Pipe data from python script ...");
    dataToSend = data.toString();
    console.log(dataToSend);
  });
  // in close event we are sure that stream from child process is closed
  python.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
  });
  return python;
};
