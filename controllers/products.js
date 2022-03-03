const Product=require('../models/product')


const getAllProductsStatic=async(req,res)=>{
    // const search='a'

    const products=await Product.find({

        // name:{$regex:search,$options:'i'},   //oprtios = i means case insensetive (all items that contains a)
    }).sort('name price').select('name price')                      //name=a to z and price low to high
    res.status(200).json({msg:products})
}

const getAllProducts=async(req,res)=>{
    console.log(req.query)

    const {featured, company, name, sort, fields, numericFilters}=req.query;                //fields == select in mongoose

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

                                                    //need more focus here
    if(numericFilters){
        console.log(numericFilters,'______')
        const operatorMap={
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',
        }
        const regEx=/\b(<|>|>=|=|<|<=)\b/g

        let filters=numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`)
        console.log(filters)

        const options=['price','rating'];
        filters=filters.split(',').forEach((item)=>{
            const [field,operator,value]=item.split('-');
            if(options.includes(field)){
                queryObject[field]={[operator]:Number(value)}           //learn why here operator is in [ ] brackets
            }
            
        })
        console.log(queryObject,"________-")
    }

    let result=Product.find(queryObject);

    if(sort){
        const sortList=sort.split(',').join(' ');
        result=result.sort(sortList);               //4:30:00 might helpfull 
        console.log(sort)
    }else{
        result=result.sort('createdAt');
    }

    if(fields){
        fieldsData= fields.split(',').join(' ');
        result=result.select(fieldsData);
    }
    
    // if(limit){
    //     result=result.limit(Number(limit));
    // }

    const page=Number(req.query.page) || 1
    const limit=Number(req.query.limit) || 10
    const skip=(page-1) * limit;

    result=result.skip(skip).limit(limit)
     
    const products=await result;

    res.status(200).json({products, nbHits:products.length})
}

module.exports={
    getAllProducts,
    getAllProductsStatic,
}

