const fs = require('fs');
const file = process.argv[2];
let html = fs.readFileSync(file, 'utf8');

const startTag = '<style id="tt-ps-css">';
const endTag = '</section>';

const startIdx = html.indexOf(startTag);
if (startIdx === -1) { console.log('NOT FOUND'); process.exit(1); }
const endIdx = html.indexOf(endTag, startIdx) + endTag.length;

const replacement = `<div class="elementor-element elementor-element-0c7dfde e-con-full e-flex e-con e-parent" data-id="0c7dfde" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
		<div class="elementor-element elementor-element-0270626 e-flex e-con-boxed e-con e-child" data-id="0270626" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-95e112d e-con-full e-flex e-con e-child" data-id="95e112d" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-1ec3c8a elementor-widget elementor-widget-heading" data-id="1ec3c8a" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">Gestiona y optimiza tus procesos de trabajo </h2>				</div>
				</div>
				</div>
				<div class="elementor-element elementor-element-4876048 elementor-widget elementor-widget-template" data-id="4876048" data-element_type="widget" data-e-type="widget" data-widget_type="template.default">
				<div class="elementor-widget-container">
							<div class="elementor-template">
			<style id="elementor-post-29035">.elementor-29035 .elementor-element.elementor-element-ad55c84{--display:flex;--flex-direction:column;--container-widget-width:100%;--container-widget-height:initial;--container-widget-flex-grow:0;--container-widget-align-self:initial;--flex-wrap-mobile:wrap;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-29035 .elementor-element.elementor-element-50d599f{--display:flex;--flex-direction:row;--container-widget-width:initial;--container-widget-height:100%;--container-widget-flex-grow:1;--container-widget-align-self:stretch;--flex-wrap-mobile:wrap;--border-radius:0px 0px 0px 0px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-29035 .elementor-element.elementor-element-aea1442{--display:flex;--justify-content:flex-start;--gap:20px 20px;--row-gap:20px;--column-gap:20px;--border-radius:20px 20px 20px 20px;--padding-top:30px;--padding-bottom:20px;--padding-left:0px;--padding-right:0px;}.elementor-29035 .elementor-element.elementor-element-aea1442:not(.elementor-motion-effects-element-type-background), .elementor-29035 .elementor-element.elementor-element-aea1442 > .elementor-motion-effects-container > .elementor-motion-effects-layer{background-color:var( --e-global-color-19569c32 );}.elementor-29035 .elementor-element.elementor-element-e093e0e{--display:flex;--min-height:90px;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:20px;--padding-right:20px;}.elementor-widget-heading .elementor-heading-title{color:var( --e-global-color-primary );}.elementor-29035 .elementor-element.elementor-element-e828104 > .elementor-widget-container{padding:0px 30px 0px 30px;}.elementor-29035 .elementor-element.elementor-element-e828104{text-align:center;}.elementor-29035 .elementor-element.elementor-element-e828104 .elementor-heading-title{font-size:24px;color:var( --e-global-color-text );}.elementor-widget-image .widget-image-caption{color:var( --e-global-color-text );}.elementor-29035 .elementor-element.elementor-element-7c61f03 img{width:54%;height:250px;object-fit:contain;object-position:center center;}.elementor-widget-text-editor{color:var( --e-global-color-text );}.elementor-widget-text-editor.elementor-drop-cap-view-stacked .elementor-drop-cap{background-color:var( --e-global-color-primary );}.elementor-widget-text-editor.elementor-drop-cap-view-framed .elementor-drop-cap, .elementor-widget-text-editor.elementor-drop-cap-view-default .elementor-drop-cap{color:var( --e-global-color-primary );border-color:var( --e-global-color-primary );}.elementor-29035 .elementor-element.elementor-element-df78611 > .elementor-widget-container{padding:0px 20px 0px 20px;}.elementor-29035 .elementor-element.elementor-element-e4eb17a{--display:flex;--justify-content:flex-start;--gap:20px 20px;--row-gap:20px;--column-gap:20px;--border-radius:20px 20px 20px 20px;--padding-top:30px;--padding-bottom:20px;--padding-left:0px;--padding-right:0px;}.elementor-29035 .elementor-element.elementor-element-e4eb17a:not(.elementor-motion-effects-element-type-background), .elementor-29035 .elementor-element.elementor-element-e4eb17a > .elementor-motion-effects-container > .elementor-motion-effects-layer{background-color:var( --e-global-color-19569c32 );}.elementor-29035 .elementor-element.elementor-element-88918ff{--display:flex;--min-height:90px;--margin-top:0px;--margin-bottom:0px;--margin-left:0px;--margin-right:0px;--padding-top:0px;--padding-bottom:0px;--padding-left:20px;--padding-right:20px;}.elementor-29035 .elementor-element.elementor-element-d5f3b95 > .elementor-widget-container{padding:0px 30px 0px 30px;}.elementor-29035 .elementor-element.elementor-element-d5f3b95{text-align:center;}.elementor-29035 .elementor-element.elementor-element-d5f3b95 .elementor-heading-title{font-size:24px;color:var( --e-global-color-text );}.elementor-29035 .elementor-element.elementor-element-465ff42 img{width:40%;height:250px;object-fit:contain;object-position:center center;}.elementor-29035 .elementor-element.elementor-element-e7bc362 > .elementor-widget-container{padding:0px 20px 0px 20px;}</style>		<div data-elementor-type="section" data-elementor-id="29035" class="elementor elementor-29035" data-elementor-post-type="elementor_library">
			<div class="elementor-element elementor-element-ad55c84 e-con-full e-flex e-con e-parent" data-id="ad55c84" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
		<div class="elementor-element elementor-element-50d599f e-flex e-con-boxed e-con e-child" data-id="50d599f" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-aea1442 e-flex e-con-boxed e-con e-child" data-id="aea1442" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-e093e0e e-con-full e-flex e-con e-child" data-id="e093e0e" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-e828104 elementor-widget elementor-widget-heading" data-id="e828104" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">Tus activos e instalaciones fallan cuando la información está dispersa.
</h2>				</div>
				</div>
				</div>
				<div class="elementor-element elementor-element-7c61f03 elementor-widget elementor-widget-image" data-id="7c61f03" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
				<div class="elementor-widget-container">
															<img loading="lazy" decoding="async" width="815" height="644" src="/wp-content/uploads/2025/11/Recurso-40.25xlowres.png" class="attachment-large size-large wp-image-29677" alt="" srcset="/wp-content/uploads/2025/11/Recurso-40.25xlowres.png 815w, /wp-content/uploads/2025/11/Recurso-40.25xlowres-633x500.png 633w, /wp-content/uploads/2025/11/Recurso-40.25xlowres-768x607.png 768w" sizes="(max-width: 815px) 100vw, 815px">															</div>
				</div>
				<div class="elementor-element elementor-element-df78611 elementor-widget elementor-widget-text-editor" data-id="df78611" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p>Tareas duplicadas, evidencias incompletas, inspecciones sin cierre y documentos repartidos en múltiples sistemas dificultan la continuidad operativa y el cumplimiento.</p>								</div>
				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-e4eb17a e-flex e-con-boxed e-con e-child" data-id="e4eb17a" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-88918ff e-con-full e-flex e-con e-child" data-id="88918ff" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-d5f3b95 elementor-widget elementor-widget-heading" data-id="d5f3b95" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">TicTAP unifica todo lo que ocurre en cada instalación.
</h2>				</div>
				</div>
				</div>
				<div class="elementor-element elementor-element-465ff42 elementor-widget elementor-widget-image" data-id="465ff42" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
				<div class="elementor-widget-container">
															<img loading="lazy" decoding="async" width="691" height="771" src="/wp-content/uploads/2025/11/ilustracion-30.25xlowres.png" class="attachment-large size-large wp-image-29683" alt="" srcset="/wp-content/uploads/2025/11/ilustracion-30.25xlowres.png 691w, /wp-content/uploads/2025/11/ilustracion-30.25xlowres-448x500.png 448w" sizes="(max-width: 691px) 100vw, 691px">															</div>
				</div>
				<div class="elementor-element elementor-element-e7bc362 elementor-widget elementor-widget-text-editor" data-id="e7bc362" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									Cada actividad queda registrada y vinculada a su activo correspondiente, permitiendo una supervisión precisa y una operativa sin fricciones.
								</div>
				</div>
					</div>
				</div>
					</div>
				</div>
				</div>
				</div>
				</div>
						</div>
				</div>
					</div>
				</div>
				<div class="elementor-element elementor-element-b45406c elementor-align-center elementor-mobile-align-center elementor-widget elementor-widget-button" data-id="b45406c" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
									<div class="elementor-button-wrapper">
					<a class="elementor-button elementor-button-link elementor-size-sm elementor-animation-shrink" href="/contacto/" id="see-how">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Ver cómo</span>
					</span>
					</a>
				</div>
								</div>
				</div>
				</div>`;

html = html.slice(0, startIdx) + replacement + html.slice(endIdx);
fs.writeFileSync(file, html, 'utf8');
console.log('done');
