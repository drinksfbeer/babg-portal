const json2csv = require('json2csv').parse;
const moment = require('moment');
const Submission = require('../models/submission');
const Form = require('../models/form');
const crud = require('./default/crud');
// const prettyError = require('../helpers/prettyError');

const exportDateFormat = 'M/D/Y h:mm:ss A';
const submissionsController = crud(Submission);

submissionsController.index = async (req, res) => {
  const { formUuid } = req.query;

  const foundSubmissions = await Submission
    .find({ formUuid })
    .populate('form')
    .sort({ created: -1 });

  if (foundSubmissions) {
    return res.json(foundSubmissions);
  }
  return res.status(400);
};

// exports submissions to csv
submissionsController.export = async (req, res) => {
  const { formUuid } = req.query;

  if (!formUuid) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    // first, build the array of the `question`s where each element corresponds
    // to a column in the final csv file
    const form = await Form.findOne({ uuid: formUuid });
    if (!form) {
      return res.status(404).json({ err: 'form_not_found' });
    }
    const fields = [
      'Submitted',
      ...form.sections.map(section => section.question)
    ];

    // then, figure out which keys require special processing, such as dates and arrays
    const specialKeys = {}; // key is the key of the field, value is the type
    for (const section of form.sections) {
      switch (section.fieldType) {
        case 'Date Picker': {
          specialKeys[section.question] = 'date';
          continue;
        }

        case 'Toggle': {
          specialKeys[section.question] = 'boolean';
          continue;
        }

        case 'Multi-Select Dropdown': {
          specialKeys[section.question] = 'array';
          continue;
        }

        default: break;
      }
    }

    // now query for all the form submissions
    const submissions = await Submission
      .find({ formUuid })
      .populate('form')
      .sort({ created: -1 });
    const results = submissions.map(submission => ({
      Submitted: moment(submission.created).format(exportDateFormat),
      ...submission.results,
    }));

    // apply special processing for every result
    for (const result of results) {
      for (const key in result) {
        if (!specialKeys.hasOwnProperty(key)) continue;
        switch (specialKeys[key]) {
          case 'date': {
            result[key] = moment(result[key]).format(exportDateFormat);
            continue;
          }

          case 'boolean': {
            result[key] = result[key] ? 'Yes' : 'No';
            continue;
          }

          case 'array': {
            result[key] = result[key].join(';');
            continue;
          }

          default: break;
        }
      }
    }

    // parse all the results into a object that contains the csv's
    const csv = json2csv(results, { fields, quote: '' });

    // prepare the response headers so the browser knows to initiate a download
    const fileName = `${form.slug}-${Date.now()}`;
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}.csv`);
    res.set('Content-Type', 'text/csv');

    // return the csv "file" for downloading
    return res.send(csv);
  } catch (error) {
    return res.status(500).json({ err: error });
  }

  // const foundSubmissions = await Submission
  //   .find({ formUuid })
  //   .populate('form')
  //   .sort({ created: -1 });
};

// submissionsController.create = (req, res) => {
//   const { pkg } = req.body;
//   const newItem = new Submission(pkg);
//   newItem.save((err, savedItem) => {
//     if (err) {
//       console.log(err); // eslint-disable-line
//       return res.status(400).json({ err: prettyError(err) });
//     }
//     return res.json(savedItem);
//   });
// };

module.exports = submissionsController;
