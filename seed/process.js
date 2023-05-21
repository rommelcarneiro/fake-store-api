const fs=require('fs');

const produtos = JSON.parse(fs.readFileSync('listaprodutos.json', 'utf8'));

// percorre o arrays de produtos, pega o id, le um arquivo com o nome do id e extensão json, complementa o objeto de produto, inserindo atributos a partir dos atributos do aquivo sendo, title com productDisplayName, price com price, description com productDescriptors.description.value, image com styleImages.default.imageURL, category com masterCategory.typeName + subCategory.typeName e por fim, salva o objeto no arquivo result.json. 
const completarProduto = (produto, dados) => {
    produto.title = dados.productDisplayName;
    produto.price = dados.price;
    produto.description = dados.productDescriptors.description.value;
    produto.image = dados.styleImages.default.imageURL;
    produto.brandName = dados.brandName;
    produto.season = dados.season;
    produto.usage = dados.usage;
    produto.gender = dados.gender;
    produto.articleNumber = dados.articleNumber;
    produto.baseColour = dados.baseColour;
    produto.year = dados.year;
    produto.articleType = dados.articleType.typeName;
    produto.displayCategories = dados.displayCategories;
    produto.category = `${dados.masterCategory.typeName} - ${dados.subCategory.typeName}`;
    produto.rating = { rate: Number.parseFloat((2+Math.random()*3).toPrecision(2)), count: Math.round(50+Math.random()*600) };
  };
  
const salvarResultado = (result) => {
    fs.writeFile('products.json', JSON.stringify(result), (err) => {
        if (err) {
            console.error('Erro ao salvar o arquivo products.json:', err);
        } else {
            console.log('Arquivo products.json salvo com sucesso!');
        }
    });
};
  
const processarProdutos = () => {
    const result = [];
    total = produtos.length;

    produtos.forEach((produto) => {
        const filePath = `/Users/rommelcarneiro/Downloads/fashion-dataset/styles/${produto.id}.json`;

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Erro ao ler o arquivo ${filePath}:`, err);
                return;
            }

            try {
                const dados = JSON.parse(data);
                completarProduto(produto, dados.data);
                result.push(produto);

                if (result.length === total) 
                    salvarResultado(result);

            } catch (error) {
                total --;
                console.error(`Erro ao processar os dados do arquivo ${filePath}:`, error);
            }
        });
    });
};


processarProdutos()
