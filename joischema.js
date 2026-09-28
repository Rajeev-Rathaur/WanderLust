const joischema=require("joi");

module.exports.listingschema=joischema.object({
    listing: joischema.object({
        title :joischema.string().required(),
        description:joischema.string().required(),
        location:joischema.string().required(),
        country:joischema.string().required(),
        price: joischema.number().required().min(0),
        image:joischema.string().allow("",null),
    }).required(),
});