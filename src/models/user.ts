import mongoose from 'mongoose'
//import findOrCreate from 'mongoose-findorcreate' // ---> @Typescript .d.ts added manually
import { Password } from '../middleware'

/* 
1. Typescipt things 
   1.1 interface for shema attributes to refelct schema
   1.2 interface for each document
   1.3 interface for model
2. create Schema
3. Alias to Model
4. Export Model
 */

interface UserAttrs {
  _id?: string
  name: string
  email: string
  password: string
  provider: string
}

// #3. An interface that describes the properties that  a User Document has

interface UserDoc extends mongoose.Document<UserAttrs> {
  email: string
  password: string
  name: string
}

// #2. An interface that describes the propertoes that a User model has

interface userModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
  findOrCreate(condition: any, doc: any): any
}

const userSchema = new mongoose.Schema<UserDoc, userModel>(
  {
    name: {
      type: String,
    },
    provider: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      length: 7,
    },
    lastloginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password
      },
    },
  }
)

// Document middlewares
userSchema.pre('save', async function (next) {
  // to encryt the passord when user creation
  const user = this

  if (user.isModified('password')) {
    // when user is created or updated
    user.password = await Password.toHash(user.password)
  }

  next()
})

userSchema.statics.build = (user: UserAttrs) => {
  // #1. to wrap 'new User()' expresstion by enforcing of UserAttrs
  return new User(user)
}

userSchema.statics.findOrCreate = function findOrCreate(conditions, callback) {
  console.log(`===>findOrCreate`)
  console.log(conditions)

  var self = this
  // When using Mongoose 5.0.x and upper, we must use self.base.Promise
  var Promise = self.base.Promise.ES6
    ? self.base.Promise.ES6
    : self.base.Promise
  this.findOne(conditions, function (err: any, result: any) {
    if (err || result) {
      callback(err, result, false)
    } else {
      console.log('-->callback')

      for (var key in callback) {
        console.log(callback[key])
        conditions[key] = callback[key]
      }

      // If the value contain `$` remove the key value pair
      var keys = Object.keys(conditions)

      for (var z = 0; z < keys.length; z++) {
        var value = JSON.stringify(conditions[keys[z]])
        if (value && value.indexOf('$') !== -1) {
          delete conditions[keys[z]]
        }
      }

      var obj = new self(conditions)
      obj.save(function (err) {
        callback(err, obj, true)
      })
    }
  })
}

/* 
userSchema.statics.findOrCreate = function findOrCreate(conditions, doc, options, callback) {
  var self = this;
  // When using Mongoose 5.0.x and upper, we must use self.base.Promise
  var Promise = self.base.Promise.ES6 ? self.base.Promise.ES6 : self.base.Promise;
  if (arguments.length < 4) {
    if (typeof options === 'function') {
      // Scenario: findOrCreate(conditions, doc, callback)
      callback = options;
      options = {};
    } else if (typeof doc === 'function') {
      // Scenario: findOrCreate(conditions, callback);
      callback = doc;
      doc = {};
      options = {};
    } else {
      // Scenario: findOrCreate(conditions[, doc[, options]])
      return new Promise(function(resolve, reject) {
        self.findOrCreate(conditions, doc, options, function (ex, result, created) {
          if (ex) {
            reject(ex);
          } else {
            resolve({
              doc: result,
              created: created,
            });
          }
        });
      });
    }
  }
  this.findOne(conditions, function(err, result) {
    if (err || result) {
      if (options && options.upsert && !err) {
        self.update(conditions, doc, function(err, count) {
          self.findById(result._id, function(err, result) {
            callback(err, result, false);
          });
        });
      } else {
        callback(err, result, false);
      }
    } else {
      for (var key in doc) {
       conditions[key] = doc[key];
      }

      // If the value contain `$` remove the key value pair
      var keys = Object.keys(conditions);

      for (var z = 0; z < keys.length; z++) {
        var value = JSON.stringify(conditions[keys[z]]);
        if (value && value.indexOf('$') !== -1) {
          delete conditions[keys[z]];
        }
      }

      var obj = new self(conditions);
      obj.save(function(err) {
        callback(err, obj, true);
      });
    }
  });
};

 */

const User = mongoose.model<UserDoc, userModel>('User', userSchema)

export { User, UserAttrs, UserDoc }
