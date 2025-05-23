---
hide:
  - navigation
---

<div align="center">
  <h1>🎯 Cybersecurity Compliance 🌍</h1>
</div>

The formula is simple:

$$
\text{Quality} + \text{Security} = \text{Trust}
$$


> Applies to governments, investors, companies, clients, users among others...


<div align="center">
  <div align="center">
    <a href="https://divisioncero.com/home/cybersecurity-kit" target="_blank" style="text-decoration: none;">
      <button style="background-color: #0078D4; color: white; border: none; padding: 10px 20px; font-size: 16px; border-radius: 5px; cursor: pointer;">
        Cybersecurity Kit Download
      </button>
    </a>
  </div>
</div>


## 🛡️ Cybersecurity Policy

:   !!! tip "Cybersecurity Policy"

        We believe in a digital world built on freedom, responsibility, and integrity.

        Cybersecurity is not just about defense — it’s about mutual respect. It’s about striving to do your best that every interaction, every line of code, and every user experience reflects a commitment to doing right things, not just the right things.


## 🤝 Sections

<div class="grid cards" markdown>

- :information_source: __[Template Policies]__
- :green_heart: __[Baseline]__

</div>

  [Template Policies]: ./policies/index.md
  [Baseline]: ./baseline/index.md


## 🎯 Why use this site?

- [X] **Trust among stakeholders:** Applies to investors, governments, companies, clients, and users.  
- [X] **Define baseline policies:** Establishes a common framework for security management.  
- [X] **Team training:** Supports initial and ongoing training for collaborators.  
- [X] **Simplify audits:** Demonstrates a structured approach during external evaluations.  
- [X] **Scale security practices:** Enables replication of best practices across different contexts.  
- [X] **Optimize Business as Usual (BaU):** Improves operational efficiency and risk management.  


## 🔍 Compliance

We're referring to the [Cloud Security Alliance](https://cloudsecurityalliance.org/?from=kudo.divisioncero.com) because we've found it aligns with the reality of cloud environments. We invite you to visit their website and attend their events; they're great role models.

``` mermaid
graph LR
  CSA[Cloud Security Alliance]
  DOMAINS[17 Domains]
  CONTROLS[197 Controls]
  ISO[ISO/IEC 27001]
  SOC2[SOC 2]
  PCI[PCI-DSS]
  NIST[NIST 800-53]
  OTHERS[others that exist or are being created]
  NOTWHEEL[Note: We're not reinventing the wheel]

  CSA --> DOMAINS
  DOMAINS --> CONTROLS
  CONTROLS --> ISO
  CONTROLS --> SOC2
  CONTROLS --> PCI
  CONTROLS --> NIST
  CONTROLS --> OTHERS
  NOTWHEEL
```


## 🏛️ Document Governance

### Enterprise Context

This means that the documents are not only applicable to a specific project or team but are intended to be used across the entire organization.

All documents are created and maintained in a hypothetical business context is your name is `Kudo`.

### 🌐 Hypothetical Business Context

- [X] A technology company offering software as a service (SaaS).
- [X] Has teams for software development, infrastructure, quality, and security; also applicable in outsourced contexts.
- [X] Operates its infrastructure across multiple Cloud Service Providers (CSPs).  
- [X] Serves clients in various countries.  
- [X] Employs collaborators working both on-site and remotely.

### 🪪 Roles and Responsibilities

- [X] **CISO or similar roles:** Sponsor of the information security and governance policy.
- [X] **GRC / Risk:** Curators of the document architecture. Responsible for the document lifecycle.
- [X] **Process Owners:** Responsible for keeping the policies and procedures applicable to their areas up to date.
- [X] **Internal Audit / Quality:** Verify validity and traceability.
- [X] **Collaborators:** Responsible for complying with established policies and procedures.

### 🔄 Document life cycle 

``` mermaid 
graph LR
  A[📌 Need] --> B[✍️ Creation]
  B --> C[🔍 Review]
  C --> D[🌀 Versioning]
  D --> E[📢 Publication]
  E --> F[🔄 Update]
  F --> A
```


## 📙 Philosophy

*Let’s build technology that is worthy of trust—not just designed to make attacks harder.  
Let’s write code meant to be shared, not hidden.  
Each line of code is a link in a global chain with the potential to improve people’s lives.*

*Let’s stand together against the ego in cybersecurity that has affected us all, often leading to the creation of redundant frameworks, standards, references, and guidelines—each centered on its own vision, without truly aiming to unify or bring greater value to a safer world. This fragmentation has resulted in decades of best practices that, while valid, remain disconnected from real and widespread applicability. True progress will only come when we stop competing and start collaborating for cybersecurity that is more accessible and effective for everyone.*

*Finally, let’s always remember that technology exists to serve people. We must not allow technological advancement to dehumanize us or pull us away from our essential purpose: to create tools that empower, protect, and uplift people in their everyday lives. Cybersecurity is, above all, an ethical responsibility to those who trust us to safeguard their privacy, their rights, and their freedom in the cyberspace.*


## 📂 Documentation structure

``` { .sh .no-copy }
/Cybersecurity Compliance/
├── Policies/
├── Best Practices/
│   ├── Baseline/
│   ├── Tools/
│   └── Courses/
```


## 💾 Clarifications

??? information "Versioning"

    The versioning of documents follows this nomenclature:

    - Continuous changes vX.Y.Z
        - X: Major version (significant changes)
        - Y: Minor version (improvements or minor changes)
        - Z: Patch version (bug fixes)
        - Example: v1.0.0 (initial version), v1.1.0 (improvements), v1.1.1 (bug fixes)

    - Releases grouped on the site at a general level are referenced by year and quarter:
        - Example: 2025-Q2 (initial version of the second quarter of 2025)

??? information "Change Control"

    Change control is carried out continuously with traceability through the git flow; specifically through Pull Requests (PR), which can be validated in the following [repository](https://github.com/PetterVargas/divisioncero.com). At the top right of the website, there is a direct link.

??? information "Scope"

    We aim for the scope of this project to be broad and for its applicability in each context to be general, not segmented. Therefore, each document is intended to be applicable to any context and not just a specific one.
