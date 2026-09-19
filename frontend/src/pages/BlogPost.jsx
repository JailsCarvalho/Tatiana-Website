import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import Seo from "@/components/Seo";
import { Skeleton } from "@/components/ui/skeleton";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const VIDEO_EXT = /\.(mp4|webm|mov)(\?|$)/i;

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    axios
      .get(`${API}/blog/${slug}`)
      .then((r) => active && setPost(r.data))
      .catch(() => active && setNotFound(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div
        className="mx-auto w-full max-w-[1200px]"
        data-testid="blog-post-loading-state"
        aria-busy="true"
        aria-label="A carregar o artigo"
      >
        <header className="pt-28 md:pt-36 pb-12 md:pb-16 px-6 md:px-10">
          <Skeleton className="h-3 w-24 bg-black/[0.07]" />
          <Skeleton className="mt-6 h-3 w-56 bg-black/[0.07]" />
          <Skeleton className="mt-6 h-12 md:h-20 w-full max-w-4xl bg-black/[0.07]" />
          <Skeleton className="mt-4 h-12 md:h-20 w-3/5 max-w-2xl bg-black/[0.07]" />
          <Skeleton className="mt-8 h-6 w-full max-w-2xl bg-black/[0.07]" />
        </header>
        <div className="border-t border-black">
          <Skeleton className="w-full aspect-[4/5] bg-black/[0.07]" />
        </div>
        <div className="border-t border-black px-6 md:px-10 py-16 md:py-24">
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-8 md:col-start-3 space-y-4">
              {[
                "w-full",
                "w-11/12",
                "w-full",
                "w-4/5",
                "w-full",
                "w-10/12",
                "w-3/5",
              ].map((w, i) => (
                <Skeleton key={i} className={`h-5 ${w} bg-black/[0.07]`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="pt-28 md:pt-36 pb-24 px-6 md:px-10" data-testid="page-blog-post-not-found">
        <Seo title="Artigo não encontrado | Atelier Galeria Ícone Coimbra" path={`/blog/${slug}`} />
        <p className="num-marker text-black/60">— N.º 000</p>
        <h1 className="mt-6 display text-5xl md:text-7xl leading-[0.95]">
          Artigo não <span className="italic">encontrado</span>.
        </h1>
        <p className="mt-8 font-serif text-xl italic text-black/70 max-w-xl">
          Pode ter sido removido, ou o endereço não está certo.
        </p>
        <Link to="/blog" className="mt-10 inline-block num-marker link-underline">
          ← Voltar à Agenda
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto w-full max-w-[1200px]" data-testid="page-blog-post">
      <Seo
        title={`${post.title} | Atelier Galeria Ícone Coimbra`}
        description={post.excerpt || post.title}
        path={`/blog/${post.slug}`}
        image={post.cover_image_url || undefined}
      />

      <header className="pt-28 md:pt-36 pb-12 md:pb-16 px-6 md:px-10">
        <Link to="/blog" className="num-marker link-underline text-black/60">
          ← Agenda
        </Link>
        <div className="mt-6 flex items-baseline gap-4 num-marker text-black/50">
          {post.date && <span>{post.date}</span>}
          {post.read && <span>· Leitura {post.read}</span>}
        </div>
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="mt-6 display text-5xl md:text-7xl lg:text-8xl leading-[0.92] max-w-4xl"
          data-testid="blog-post-title"
        >
          {post.title}
        </motion.h1>
        {post.excerpt && (
          <p className="mt-8 font-serif text-xl md:text-2xl italic text-black/75 max-w-2xl">
            {post.excerpt}
          </p>
        )}
      </header>

      {post.cover_image_url && (
        <div className="border-t border-black">
          {VIDEO_EXT.test(post.cover_image_url) ? (
            <video
              src={post.cover_image_url}
              className="w-full aspect-[4/5] object-contain bg-black/[0.03]"
              controls
              playsInline
            />
          ) : (
            <img
              src={post.cover_image_url}
              alt=""
              className="w-full aspect-[4/5] object-contain bg-black/[0.03]"
            />
          )}
        </div>
      )}

      <div className="border-t border-black px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <div className="prose-article" data-testid="blog-post-content">
              <ReactMarkdown>{post.content_md || ""}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black px-6 md:px-10 py-12">
        <Link to="/blog" className="num-marker link-underline">
          ← Voltar à Agenda
        </Link>
      </div>
    </article>
  );
}
