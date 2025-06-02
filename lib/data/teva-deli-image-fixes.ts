// Image corrections for Teva Deli products based on actual store display

export const imageCorrections = {
  // Product 11 - Shows HOT DOG package instead of tofu steaks
  'td-011': {
    currentImage: '/images/vendors/teva_deli_vegan_specialty_product_11_seitan_tofu_based_protein_alternative.jpg',
    correctImage: '/images/vendors/teva_deli_vegan_tofu_steaks_marinated_teriyaki_plant_based_protein.jpg',
    issue: 'Shows HOT DOG package instead of marinated tofu steaks'
  },
  
  // Product 12 - Shows plain white tofu instead of bacon strips
  'td-012': {
    currentImage: '/images/vendors/teva_deli_vegan_specialty_product_12_seitan_tofu_based_protein_alternative.jpg',
    correctImage: '/images/vendors/teva_deli_vegan_seitan_bacon_strips_smoky_plant_based_breakfast.jpg',
    issue: 'Shows plain tofu block instead of bacon strips'
  },
  
  // Product 30 - Sesame Schnitzel with wrong packaging
  'td-030': {
    currentImage: '/images/vendors/teva_deli_vegan_specialty_product_30_burger_schnitzel_plant_based_deli.jpg',
    correctImage: '/images/vendors/teva_deli_vegan_sesame_crusted_schnitzel_crispy_coating_plant_based.jpg',
    issue: 'Wrong packaging style shown'
  }
};

// Apply corrections
export function fixTevaDeliImages(products) {
  return products.map(product => {
    const correction = imageCorrections[product.id];
    if (correction) {
      console.log(`Fixing image for ${product.name}: ${correction.issue}`);
      return {
        ...product,
        image: correction.correctImage
      };
    }
    return product;
  });
}
