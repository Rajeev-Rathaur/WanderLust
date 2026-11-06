const joischema=require("joi");

module.exports.listingschema=joischema.object({
    listing: joischema.object({
        title :joischema.string().required(),
        description:joischema.string().required(),
        location:joischema.string().required(),
        country:joischema.string().required(),
        price: joischema.number().required().min(0),
        image:joischema.object({
            url:joischema.string().allow("",null),
            filename:joischema.string().allow("",null)}).allow("",null).optional()
        }).required()     
});


module.exports.reviewschema=joischema.object({
    review:joischema.object({
        rating:joischema.number().required().min(1).max(5),
        comment:joischema.string().required(),
    }).required()
})