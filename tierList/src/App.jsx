import { useState } from 'react'; // Importa o hook useState do React para gerenciar estados no componente.

function App() { 
  const [images, setImages] = useState([]); // Estado para armazenar imagens carregadas
  const [confirmHover, setConfirmHover] = useState(false); // Estado para controlar o hover
  const [selectedImage, setSelectedImage] = useState(null); // Estado para armazenar a imagem selecionada
  const [tiers, setTiers] = useState({ // Estado que representa grupos de categorias (tiers)
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
    E: [],
  });

  // Função para lidar com o upload de imagens
  
  const handleImageUpload = (event) => {
    if(images.length < 3){
    const files = Array.from(event.target.files); // Converte a lista de arquivos para um array
    const newImages = [];

    files.forEach(file => {
      const reader = new FileReader(); // Cria uma nova instância de FileReader para ler o conteúdo do arquivo
      reader.onload = (e) => { // Define uma função callback que será chamada quando a leitura estiver completa
        newImages.push(e.target.result); // Adiciona o resultado (URL da imagem) ao array 'newImages'
        if (newImages.length === files.length) { // Verifica se todas as imagens foram lidas
          setImages(prevImages => [...prevImages, ...newImages]); // Atualiza o estado 'images' adicionando as novas imagens
        }
      };
      reader.readAsDataURL(file); // Lê o conteúdo do arquivo como uma URL de dados (base64)
    });
  }else{
    alert("Limite de 3 Fotos Atingido, escolha um Tier para elas e Tente Novamente")
  }
  };

  // Função para selecionar uma imagem
  const handleSelectImage = (image, sourceTier = null) => {
    // Verifica se a imagem clicada já está selecionada
  if (selectedImage && selectedImage.src === image) {
    // Se for a mesma imagem, deseleciona-a
    setSelectedImage(null);
  } else {
    // Caso contrário, seleciona a nova imagem
    setSelectedImage({ src: image, sourceTier });
  }
  };

 // Função para mover a imagem para um tier
 const handleMoveToTier = (targetTier) => {
  if (selectedImage) {
    if (targetTier === null) {
      // Caso a lixeira tenha sido clicada com uma imagem selecionada
      const confirm = window.confirm('Tem certeza de que deseja excluir a Imagem Selecionada?');
      if (confirm) {
        if (selectedImage.sourceTier) {
          // Remover a imagem do tier de origem
          setTiers(prevTiers => ({
            ...prevTiers,
            [selectedImage.sourceTier]: prevTiers[selectedImage.sourceTier].filter(img => img !== selectedImage.src)
          }));
        } else {
          // Remover a imagem do formulário de upload
          setImages(prevImages => prevImages.filter(img => img !== selectedImage.src));
        }
        setSelectedImage(null); // Limpa a imagem selecionada
        setConfirmHover(true); // Permite o hover na lixeira
        setTimeout(() => {
          setConfirmHover(false);
        }, 600);
      } else {
        setConfirmHover(false);
      }
      return; // Sai da função após lidar com a exclusão
    }

    // Verificação de limite de 3 imagens em cada tier
    if (targetTier && tiers[targetTier].length >= 3) {
      alert(`O tier ${targetTier} já tem 3 imagens. Não é possível adicionar mais imagens. Tire uma imagem ou Exclua`);
      return; // Sai da função se o limite for atingido
    }

    if (selectedImage.sourceTier) {
      // Remover a imagem do tier de origem
      setTiers(prevTiers => ({
        ...prevTiers,
        [selectedImage.sourceTier]: prevTiers[selectedImage.sourceTier].filter(img => img !== selectedImage.src)
      }));
    } else {
      // Remover a imagem do formulário de upload
      setImages(prevImages => prevImages.filter(img => img !== selectedImage.src));
    }

    // Adicionar a imagem ao tier de destino
    if (targetTier) {
      setTiers(prevTiers => ({
        ...prevTiers,
        [targetTier]: [...prevTiers[targetTier], selectedImage.src]
      }));
    }

    setSelectedImage(null); // Limpa a imagem selecionada
  } else if (targetTier === null) {
    const confirm = window.confirm('Nenhuma Imagem Selecionada, certeza que quer Deletar TUDO?');
    if (confirm) {
      setImages([]);
      setTiers({
        S: [],
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
      });
      setConfirmHover(true); // Permite o hover na lixeira
      setTimeout(() => {
        setConfirmHover(false);
      }, 600);
    } else {
      setConfirmHover(false);
    }
  }
};


  return (
    <div className="body">
      <div className="container">
        <h1>Tier List</h1>
        <ul className="li">
          {['S', 'A', 'B', 'C', 'D', 'E'].map((tier) => ( // Mapeia cada tier ('S' a 'E') para criar sua seção
            <div key={tier} className="tier-group">
              <div className={`tier-label class${tier}`}>{tier}</div> {/* Rótulo com a classe correspondente ao tier */}
              <div
                className="tier-side"
                onClick={() => handleMoveToTier(tier)} // Mover a imagem selecionada para este tier ao clicar
              >
                {tiers[tier].map((image, index) => ( // Mapeia imagens em cada tier
                  <img
                    key={index}
                    src={image}
                    alt={`Tier ${tier} ${index}`} // Descrição alternativa para cada imagem
                    className={`uploaded-image ${selectedImage && selectedImage.src === image ? 'selected' : ''}`} // Adiciona uma classe para indicar seleção
                    onClick={() => handleSelectImage(image, tier)} // Seleciona a imagem ao clicar
                  />
                ))}
              </div>
            </div>
          ))}
        </ul>
        <div className="tier-group2">
          <div className="tier-side2">
            <form>
              <label htmlFor="file-upload" className="custom-file-upload">
                + {/* Botão para upload de arquivos */}
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*" // Apenas arquivos de imagem são aceitos
                  onChange={handleImageUpload} // Lida com o upload de imagens
                  style={{ display: 'none' }} // Oculta o input padrão de arquivo
                />
              </label>
            </form>
            <div className="image-container">
              {images.map((image, index) => ( // Mapeia imagens carregadas para exibição
                <img
                  key={index}
                  src={image}
                  alt={`Uploaded ${index}`} // Descrição alternativa para a imagem
                  className={`uploaded-image ${selectedImage && selectedImage.src === image ? 'selected' : ''}`} // Adiciona uma classe para indicar seleção
                  onClick={() => handleSelectImage(image)} // Seleciona a imagem ao clicar
                />
              ))}
              {/* Novo elemento de "lixo" para excluir imagens */}
               <div
                className={`trash-bin ${confirmHover ? 'hovered' : ''}`} // Aplica a classe 'hovered' somente se 'confirmHover' for true
                onClick={() => handleMoveToTier(null)} // Excluir a imagem ao clicar, caso esteja selecionada. Caso contrário, apaga todas as imagens.
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; // Exporta o componente 'App' como padrão.
