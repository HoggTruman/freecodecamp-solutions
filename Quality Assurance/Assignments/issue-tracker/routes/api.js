'use strict';

const Issue = require(process.cwd() + '/database/issueModel.js')

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      try {
        const issueList = await Issue.find(req.query);
        res.json(issueList)
      } 
      catch (err) {
        return console.error(err);
      }
    })
    
    .post(function (req, res){
      let issue = new Issue({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date().toString(),
        updated_on: "",
        created_by: req.body.created_by,
        assigned_to: req.body.created_by || "",
        open: true,
        status_text: req.body.status_text || ""
      });
      
      issue.save()
      .then(data => {
        res.json(data.toObject());
      })
      .catch(err => console.error(err));
    })
    
    .put(async function (req, res){
      let issue;
      try {
        issue = await Issue.findById(req.body._id);
      }
      catch (err) {
        return console.error(err);
      }
      // update record
      issue.issue_title = req.body.issue_title || issue.issue_title;
      issue.issue_text = req.body.issue_text || issue.issue_text;
      issue.created_on = new Date().toString();
      issue.created_by = req.body.created_by || issue.created_by;
      issue.assigned_to = req.body.assigned_to || issue.assigned_to;
      issue.status_text = req.body.status_text || issue.status_text;
      issue.open = !req.body.open;

      issue.save()
      .then(data => {
        res.json(data.toObject());
      })
      .catch(err => console.error(err));
    })
    
    .delete(async function (req, res){
      Issue.findByIdAndDelete(req.body._id)
      .then(data => {
        res.json(data);
      })
      .catch(err => console.error(err));
    });
    
};
