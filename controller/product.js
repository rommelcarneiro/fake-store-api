const product = require('../model/product');
const Product = require('../model/product');

// module.exports.getAllProducts = (req, res) => {
// 	const limit = Number(req.query.limit) || 0;
// 	const sort = req.query.sort == 'desc' ? -1 : 1;

// 	Product.find()
// 		.select(['-_id'])
// 		.limit(limit)
// 		.sort({ id: sort })
// 		.then((products) => {
// 			res.json(products);
// 		})
// 		.catch((err) => res.json ({ message: `Erro ao obter products: ${err.message}`}));
// };

module.exports.getAllProducts = async (req, res, next) => {
	const total_results = await Product.countDocuments(); 
	const sort = req.query.sort == 'desc' ? -1 : 1;

	Product.find()
		.select(['-_id'])
		.skip(req.pagination.skip) 
		.limit(req.pagination.limit) 
		.sort({ id: sort })
		.then((products) => {
			const total_pages = Math.ceil(total_results / req.pagination.page_items); 
			res.json({
			current_page: req.pagination.page,
			total_pages: total_pages,
			total_results: total_results,
			products: products
			});
		})
		.catch((err) => res.json ({ message: `Erro ao obter produtos: ${err.message}`}));

};

module.exports.getProduct = (req, res) => {
	const id = req.params.id;

	Product.findOne({
		id,
	})
		.select(['-_id'])
		.then((product) => {
			res.json(product);
		})
		.catch((err) => res.json ({ message: `Erro ao obter produto: ${err.message}`}));
};

module.exports.getProductCategories = (req, res) => {
	Product.distinct('category')
		.then((categories) => {
			res.json(categories);
		})
		.catch((err) => res.json ({ message: `Erro ao obter categorias: ${err.message}`}));
};

module.exports.getProductsInCategory = (req, res) => {
	const category = req.params.category;
	const sort = req.query.sort == 'desc' ? -1 : 1;

	Product.find({
		category,
	})
		.select(['-_id'])
		.skip(req.pagination.skip) 
		.limit(req.pagination.limit)
		.sort({ id: sort })
		.then(async (products) => {
			const total_results = await Product.countDocuments({ category });
			const total_pages = Math.ceil(total_results / req.pagination.page_items); 
			res.json({
				current_page: req.pagination.page,
				total_pages: total_pages,
				total_results: total_results, 
				products 
			});
		})
		.catch((err) => res.json ({ message: `Erro ao obter produtos de categoria: ${err.message}`}));
};

// middleware to search and return products based on path param query to product title
module.exports.getSearchProducts = (req, res) => {
	const query = req.query.query;
	
	const sort = req.query.sort == 'desc' ? -1 : 1;
	Product.find({
		title: {
			$regex: query,
			$options: 'i',
		},
	})
		.select(['-_id'])
		.limit(req.pagination.limit)
		.sort({ id: sort })
		.then((products) => {
			res.json(products);
		})
		.catch((err) => res.json ({ message: `Erro ao realizar pesquisa de produtos: ${err.message}`}));
};

module.exports.addProduct = (req, res) => {
	if (typeof req.body == undefined) {
		res.json({
			status: 'error',
			message: 'data is undefined',
		});
	} else {
		// let productCount = 0;
		// Product.find()
		//   .countDocuments(function (err, count) {
		//     productCount = count;
		//   })
		//   .then(() => {
		const product = {
			id: 21,
			title: req.body.title,
			price: req.body.price,
			description: req.body.description,
			image: req.body.image,
			category: req.body.category,
		};
		// product.save()
		//   .then(product => res.json(product))
		//   .catch(err => console.log(err))
		res.json(product);
		// });
	}
};

module.exports.editProduct = (req, res) => {
	if (typeof req.body == undefined || req.params.id == null) {
		res.json({
			status: 'error',
			message: 'something went wrong! check your sent data',
		});
	} else {
		res.json({
			id: parseInt(req.params.id),
			title: req.body.title,
			price: req.body.price,
			description: req.body.description,
			image: req.body.image,
			category: req.body.category,
		});
	}
};

module.exports.deleteProduct = (req, res) => {
	if (req.params.id == null) {
		res.json({
			status: 'error',
			message: 'cart id should be provided',
		});
	} else {
		Product.findOne({
			id: req.params.id,
		})
			.select(['-_id'])
			.then((product) => {
				res.json(product);
			})
			.catch((err) => res.json ({ message: `Erro ao exlcuir produto: ${err.message}`}));
	}
};
