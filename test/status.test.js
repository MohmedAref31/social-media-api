import request from "supertest"
import {assert, should, expect, } from "chai";
import app from "../server.js";



describe('-[Post Status] POST /api/v1/status ', function() {

  let agent = request.agent(app)
  before((done)=>{
    agent
      .post('/api/v1/auth/login')
      .send({email:"first1@gmail.com",password: "123456"})
      .expect(200)
      .end(done)
  })

    it('should post status', function(done) {
      agent
        .post('/api/v1/status')
        .send({user: '123456', contentType:"text", textContent:"test status"})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          console.log(JSON.stringify(res.body)); 
          return done();
        });
    });

    it('should failed to post status due to UnAuth', function(done) {
      request(app)
        .post('/api/v1/status')
        .send({user: '123456', contentType:"text", textContent:"test status"})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function(err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it('should delete status', function(done){
      agent
      .delete('/api/v1/status/statusId')
      .expect(200)
      .end(function(err, res) {
        console.log(JSON.stringify(res.body))
        if (err) return done(err);
        return done();
      });
    })
  });