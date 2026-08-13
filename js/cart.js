
const STORAGE_KEY = 'cozastore_cart';

			// Load cart from LocalStorage on initialization
			let cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

			function saveCart() {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
			}

			/* =========================
			UPDATE CART ICON COUNT
			========================= */
			function updateCartCount() {
				const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
				const cartIcon = document.querySelector('.js-cart-count');

				if (cartIcon) {
					cartIcon.setAttribute('data-notify', totalItems);
				}
			}

			/* =========================
			INITIALIZE PRODUCT BUTTONS
			========================= */
			document.querySelectorAll('.block2').forEach((product, index) => {
				const name = product.querySelector('.js-name-b2')?.innerText.trim();
				const price = parseFloat(
					product.querySelector('.stext-105')?.innerText.replace('$', '')
				);
				const image = product.querySelector('.block2-pic img')?.src;
				const button = product.querySelector('.add-to-cart-btn');

				if (!button || !name || isNaN(price)) return;

				// Use dataset ID if present, otherwise fallback to index string
				const productId = product.dataset.id || `prod_${index}`;

				button.addEventListener('click', (e) => {
					e.preventDefault();

					const existingProduct = cart.find(item => item.id === productId);

					if (existingProduct) {
						existingProduct.qty++;
					} else {
						cart.push({
							id: productId,
							name: name,
							price: price,
							image: image,
							qty: 1
						});
					}

					saveCart();
					renderCart();

					// Trigger CozaStore SweetAlert notification
					if (typeof swal !== 'undefined') {
						swal(name, "is added to cart !", "success");
					} else if (typeof Swal !== 'undefined' && typeof Swal.fire === 'function') {
						Swal.fire(name, "is added to cart !", "success");
					}
				});
			});

			/* =========================
			RENDER CART & OVERLAY REMOVE
			========================= */
			function renderCart() {
				const cartContainer = document.querySelector('.header-cart-wrapitem');
				const totalContainer = document.querySelector('.header-cart-total');

				if (!cartContainer || !totalContainer) return;

				cartContainer.innerHTML = '';
				let total = 0;

				if (cart.length === 0) {
					cartContainer.innerHTML = `
						<li style="padding:20px;text-align:center;">
							Cart is Empty
						</li>
					`;
					totalContainer.innerHTML = 'Total: $0.00';
					updateCartCount();
					return;
				}

				cart.forEach(item => {
					total += item.price * item.qty;

					cartContainer.innerHTML += `
						<li class="header-cart-item flex-w flex-t m-b-12">
							<div class="header-cart-item-img" data-id="${item.id}">
								<img src="${item.image}" alt="${item.name}">
							</div>

							<div class="header-cart-item-txt p-t-8">
								<a href="#" class="header-cart-item-name m-b-18 hov-cl1 trans-04">
									${item.name}
								</a>

								<span class="header-cart-item-info">
									${item.qty} x $${item.price.toFixed(2)}
								</span>
							</div>
						</li>
					`;
				});

				totalContainer.innerHTML = `Total: $${total.toFixed(2)}`;
				updateCartCount();
			}

			/* =========================
			EVENT DELEGATION: REMOVE ITEM
			========================= */
			const cartContainer = document.querySelector('.header-cart-wrapitem');
			if (cartContainer) {
				cartContainer.addEventListener('click', (e) => {
					const imgWrap = e.target.closest('.header-cart-item-img');
					if (imgWrap) {
						const id = imgWrap.getAttribute('data-id');
						removeFromCart(id);
					}
				});
			}

			function removeFromCart(id) {
				cart = cart.filter(item => item.id !== id);
				saveCart();
				renderCart();
			}

			/* =========================
			INITIAL LOAD
			========================= */
			renderCart();