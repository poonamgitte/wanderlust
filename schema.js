//Server Side Schema validation schema
//Instead of using multiple if statements for schema validation we can use joi as follow

const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("",null),
    }).required(),
});

//Server side Review validation schema
module.exports.reviewSchema=Joi.object({
    review: Joi.object({
        comment:Joi.string().required(),
        rating:Joi.number().required().min(1).max(5),

    }).required()
});