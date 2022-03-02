const Product=require('../models/product')


const getAllProductsStatic=async(req,res)=>{
    const search='a'

    const products=await Product.find({

        // name:{$regex:search,$options:'i'},   //oprtios = i means case insensetive (all items that contains a)
    }).sort('name price')                       //name=ato z and proce low to high
    res.status(200).json({msg:products})
}

const getAllProducts=async(req,res)=>{
    console.log(req.query)

    const {featured, company, name, sort}=req.query;

    const queryObject={};

    if(featured){
        queryObject.featured= featured==='true'?true:false
    }
    if(company){
        queryObject.company= company
    }
    if(name){
        queryObject.name={$regex:name,$options:'i'};
    }
    
    let result=Product.find(queryObject);

    if(sort){
        // products=products.sort();                //4:30:00 might helpfull 
        console.log(sort)
    }
    const products=await result;

    res.status(200).json({products, nbHits:products.length})
}

module.exports={
    getAllProducts,
    getAllProductsStatic,
}

