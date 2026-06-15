$dest = "vistalink\public\images\homepage"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$images = @{
  # === HERO ===
  "hero-laptop.jpg" = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&fit=crop"
  "hero-dashboard.jpg" = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&fit=crop"

  # === FEATURES ===
  "feature-landing.jpg" = "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80&fit=crop"
  "feature-funnel.jpg" = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&fit=crop"
  "feature-catalog.jpg" = "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80&fit=crop"
  "feature-minisite.jpg" = "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80&fit=crop"
  "feature-portfolio.jpg" = "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&q=80&fit=crop"
  "feature-qr.jpg" = "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=800&q=80&fit=crop"

  # === TEMPLATES / CATEGORIES ===
  "cat-restaurant.jpg" = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80&fit=crop"
  "cat-photographer.jpg" = "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=80&fit=crop"
  "cat-graphiste.jpg" = "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80&fit=crop"
  "cat-immobilier.jpg" = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80&fit=crop"
  "cat-medecin.jpg" = "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&q=80&fit=crop"
  "cat-garage.jpg" = "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=600&q=80&fit=crop"
  "cat-styliste.jpg" = "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80&fit=crop"
  "cat-commerce.jpg" = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80&fit=crop"
  "cat-consultant.jpg" = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&fit=crop"
  "cat-artisan.jpg" = "https://images.unsplash.com/photo-1452860606245-08b480b481f4?w=600&q=80&fit=crop"

  # === MOBILE ===
  "mobile-phone.jpg" = "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80&fit=crop"
  "mobile-social.jpg" = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80&fit=crop"

  # === TESTIMONIALS ===
  "testimonial-1.jpg" = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80&fit=crop"
  "testimonial-2.jpg" = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&fit=crop"
  "testimonial-3.jpg" = "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80&fit=crop"

  # === HOW IT WORKS ===
  "steps-template.jpg" = "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&q=80&fit=crop"
  "steps-editor.jpg" = "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&q=80&fit=crop"
  "steps-publish.jpg" = "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&q=80&fit=crop"
  "steps-share.jpg" = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80&fit=crop"
}

$count = 0
$total = $images.Count

foreach ($name in $images.Keys) {
  $count++
  $url = $images[$name]
  $outFile = Join-Path $dest $name
  Write-Host "[$count/$total] Telechargement: $name"
  try {
    Invoke-WebRequest -Uri $url -OutFile $outFile -UseBasicParsing -TimeoutSec 15
    Write-Host "  -> OK ($(([System.IO.FileInfo]$outFile).Length / 1KB) KB)"
  } catch {
    Write-Host "  -> ERREUR: $($_.Exception.Message)"
  }
}

Write-Host "`nTermine! $count images telechargees dans $dest"