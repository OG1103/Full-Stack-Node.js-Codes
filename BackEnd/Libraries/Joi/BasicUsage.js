import Joi from "joi";

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
});

const data = {
  username: "john_doe",
  password: "mypassword123",
  email: "john@example.com",
};

const validationResult = schema.validate(data);

if (validationResult.error) {
  console.log("Validation Error:", validationResult.error.details);
} else {
  console.log("Validation Passed!");
}

//We define a schema with the Joi.object() method.
//The schema requires username, password, and email fields, each with specific validation rules.
//The validate() method checks if the data object matches the schema.
