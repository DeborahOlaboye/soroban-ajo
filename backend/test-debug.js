const { GroupsController } = require('./dist/controllers/groupsController');

class MockResponse {
  statusCode = 200;
  body = null;
  
  status(code) {
    this.statusCode = code;
    return this;
  }
  
  json(data) {
    console.log('json called with:', data);
    this.body = data;
    return this;
  }
}

const controller = new GroupsController();
const req = { query: {} };
const res = new MockResponse();
const next = () => {};

controller.listGroups(req, res, next).then(() => {
  console.log('Response body:', res.body);
  console.log('Response status:', res.statusCode);
});
