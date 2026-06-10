import re

filepath = 'C:/Users/alexl/bretenbits-webs/tictap-web/src/casos-de-exito/trazabilidad-de-grupos-electrogenos-para-dagartech/index.html'
content = open(filepath, encoding='utf-8').read()

# 1. Remove the Elementor override <style> block
old_style = '<style>.elementor-location-header[data-astro-cid-jxpm4qrv]{display:block!important;visibility:visible!important;opacity:1!important;position:relative;z-index:1000}.elementor-location-header[data-astro-cid-jxpm4qrv] .elementor-element-6f0aaa9[data-astro-cid-jxpm4qrv],.elementor-location-header[data-astro-cid-jxpm4qrv] .elementor-element-9e15b9a[data-astro-cid-jxpm4qrv],.elementor-location-header[data-astro-cid-jxpm4qrv] .elementor-element-947f5f9[data-astro-cid-jxpm4qrv]{z-index:1001}#content[data-astro-cid-jxpm4qrv],.site-content[data-astro-cid-jxpm4qrv],.content-area[data-astro-cid-jxpm4qrv],.site-main[data-astro-cid-jxpm4qrv]{position:relative;z-index:1}\n</style>'
content = content.replace(old_style, '', 1)

# 2. Locate and replace the legacy Elementor header
header_start = content.find('<header data-elementor-type="header" data-elementor-id="9642"')
header_end = content.find('</header>\n<main>')
old_header = content[header_start : header_end + len('</header>')]

new_header = open('C:/Users/alexl/bretenbits-webs/tictap-web/bin/_tt_header_es.html', encoding='utf-8').read()

content = content.replace(old_header, new_header, 1)

print('tt-header in content:', 'tt-header' in content)
print('elementor-9642 in content:', 'elementor-9642' in content)
print('elementor override style removed:', 'elementor-location-header[data-astro-cid-jxpm4qrv]' not in content)

open(filepath, 'w', encoding='utf-8').write(content)
print('File written OK')
